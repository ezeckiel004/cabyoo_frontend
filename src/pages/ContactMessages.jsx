import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import { 
  FaEnvelope, FaEye, FaReply, FaTrash, FaCheck, FaClock, 
  FaUser, FaSearch, FaSync, FaEnvelopeOpen, FaArchive
} from "react-icons/fa";
import AdminReplyModal from "../components/AdminReplyModal";
import MessageDetailModal from "../components/MessageDetailModal";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    processed: 0
  });

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      
      const response = await adminAPI.getContactMessages(params);
      console.log("Messages:", response.data);
      
      if (response.data && response.data.data) {
        setMessages(response.data.data.data || response.data.data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getContactStats();
      console.log("Stats:", response.data);
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminAPI.markContactAsRead(id);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleMarkAsProcessed = async (id) => {
    try {
      await adminAPI.markContactAsProcessed(id);
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleArchive = async (id) => {
    if (window.confirm("Archiver ce message ?")) {
      try {
        await adminAPI.archiveContactMessage(id);
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer définitivement ce message ?")) {
      try {
        await adminAPI.deleteContactMessage(id);
        fetchMessages();
        fetchStats();
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
    setShowDetailModal(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      read: "bg-blue-100 text-blue-800",
      processed: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800"
    };
    const labels = {
      pending: "En attente",
      read: "Lu",
      processed: "Traité",
      archived: "Archivé"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("fr-FR");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Messages de contact</h1>
            <p className="text-gray-600">Gérez les messages envoyés par les utilisateurs</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FaEnvelope className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <FaClock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lus</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
                </div>
                <FaEnvelopeOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Traités</p>
                  <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
                </div>
                <FaCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="p-4 mb-6 bg-white rounded-lg shadow">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou sujet..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-48">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="read">Lu</option>
                  <option value="processed">Traité</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              <button
                onClick={fetchMessages}
                className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <FaSync className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          {/* Liste des messages */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center">
                <FaEnvelope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucun message trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div key={message.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{message.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{message.email}</span>
                          {message.phone && (
                            <span className="text-sm text-gray-500">📞 {message.phone}</span>
                          )}
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Sujet:</span>
                          <span className="ml-2 text-sm text-gray-600">{message.subject}</span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📅 {formatDate(message.created_at)}</span>
                          {message.replied_at && (
                            <span>✅ Répondu le {formatDate(message.replied_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {/* Bouton Voir détails (œil) */}
                        <button
                          onClick={() => handleViewDetails(message)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Voir les détails"
                        >
                          <FaEye />
                        </button>
                        
                        {message.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Marquer comme lu"
                          >
                            <FaEnvelopeOpen />
                          </button>
                        )}
                        {message.status !== 'processed' && message.status !== 'archived' && (
                          <button
                            onClick={() => handleMarkAsProcessed(message.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Marquer comme traité"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleReply(message)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Répondre"
                        >
                          <FaReply />
                        </button>
                        <button
                          onClick={() => handleArchive(message.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Archiver"
                        >
                          <FaArchive />
                        </button>
                        <button
                          onClick={() => handleDelete(message.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de détails */}
      <MessageDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        type="contact"
        onReply={handleReply}
      />

      {/* Modal de réponse */}
      <AdminReplyModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        type="contact"
        onReplySent={() => {
          fetchMessages();
          fetchStats();
        }}
      />
    </div>
  );
};

export default ContactMessages;