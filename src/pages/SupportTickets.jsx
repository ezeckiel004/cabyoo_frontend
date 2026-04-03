import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import { 
  FaTicketAlt, FaEye, FaReply, FaTrash, FaCheck, FaClock, 
  FaUser, FaExclamationTriangle, FaDownload, FaSearch, FaSync,
  FaUserTag, FaPhone, FaFile, FaImage, FaFilePdf, FaTimes,
  FaPlay, FaCheckCircle
} from "react-icons/fa";
import AdminReplyModal from "../components/AdminReplyModal";
import MessageDetailModal from "../components/MessageDetailModal";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    user_type: "",
    priority: "",
    search: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    urgent: 0,
    normal: 0
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.user_type) params.user_type = filters.user_type;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      
      const response = await adminAPI.getSupportTickets(params);
      console.log("Tickets:", response.data);
      
      if (response.data && response.data.data) {
        setTickets(response.data.data.data || response.data.data);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Erreur chargement tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getSupportStats();
      console.log("Stats:", response.data);
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminAPI.updateSupportStatus(id, { status });
      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer définitivement ce ticket ?")) {
      try {
        await adminAPI.deleteSupportTicket(id);
        fetchTickets();
        fetchStats();
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await adminAPI.downloadSupportAttachment(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'attachment');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };

  const handleReply = (ticket) => {
    setSelectedTicket(ticket);
    setShowReplyModal(true);
    setShowDetailModal(false);
  };

  const handleViewAttachment = async (ticket) => {
    try {
      const response = await adminAPI.downloadSupportAttachment(ticket.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setSelectedAttachment({
        url,
        name: ticket.attachment_name || 'piece_jointe',
        type: getFileType(ticket.attachment_name),
        id: ticket.id
      });
      setShowAttachmentModal(true);
    } catch (error) {
      console.error("Erreur visualisation:", error);
    }
  };

  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'other';
  };

  const getFileIcon = (filename) => {
    const type = getFileType(filename);
    if (type === 'image') return FaImage;
    if (type === 'pdf') return FaFilePdf;
    return FaFile;
  };

  const getUserTypeLabel = (type) => {
    const labels = {
      passenger: "Passager",
      driver: "Chauffeur",
      partner: "Partenaire"
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800"
    };
    const labels = {
      pending: "En attente",
      in_progress: "En cours",
      resolved: "Résolu",
      closed: "Fermé"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    if (priority === "urgent") {
      return (
        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
          <FaExclamationTriangle className="w-3 h-3" />
          Urgent
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
        Normal
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
        <main className="flex-1 p-6 overflow-x-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tickets support</h1>
            <p className="text-gray-600">Gérez les tickets des utilisateurs</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 lg:grid-cols-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FaTicketAlt className="w-8 h-8 text-gray-500" />
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
                  <p className="text-sm text-gray-500">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
                </div>
                <FaPlay className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Résolus</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <FaCheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Urgents</p>
                  <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
                </div>
                <FaExclamationTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Normaux</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.normal}</p>
                </div>
                <FaTicketAlt className="w-8 h-8 text-blue-500" />
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
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="w-40">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tous statuts</option>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
              <div className="w-40">
                <select
                  value={filters.user_type}
                  onChange={(e) => setFilters({ ...filters, user_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tous types</option>
                  <option value="passenger">Passager</option>
                  <option value="driver">Chauffeur</option>
                  <option value="partner">Partenaire</option>
                </select>
              </div>
              <div className="w-32">
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Priorité</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <button
                onClick={fetchTickets}
                className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <FaSync className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          {/* Liste des tickets */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center">
                <FaTicketAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucun ticket trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 min-w-[800px]">
                {tickets.map((ticket) => {
                  const FileIcon = getFileIcon(ticket.attachment_name);
                  const isImage = getFileType(ticket.attachment_name) === 'image';
                  
                  return (
                    <div key={ticket.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <FaUserTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-medium text-gray-900">
                                {getUserTypeLabel(ticket.user_type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{ticket.phone}</span>
                            </div>
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Motif:</span>
                            <span className="ml-2 text-sm text-gray-600">{ticket.concern_type}</span>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-2 break-words">
                              {ticket.message}
                            </p>
                          </div>
                          
                          {/* Pièce jointe */}
                          {ticket.attachment_path && (
                            <div className="mb-3 flex items-center gap-3 flex-wrap">
                              <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate max-w-[200px]">{ticket.attachment_name}</span>
                              {isImage ? (
                                <button
                                  onClick={() => handleViewAttachment(ticket)}
                                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded"
                                >
                                  <FaImage className="w-3 h-3" />
                                  Visualiser
                                </button>
                              ) : null}
                              <button
                                onClick={() => handleDownload(ticket.id, ticket.attachment_name)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                              >
                                <FaDownload className="w-3 h-3" />
                                Télécharger
                              </button>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <span>📅 {formatDate(ticket.created_at)}</span>
                            {ticket.replied_at && (
                              <span>✅ Répondu le {formatDate(ticket.replied_at)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          {/* Bouton Voir détails (œil) */}
                          <button
                            onClick={() => handleViewDetails(ticket)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          
                          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Prendre en charge"
                              >
                                <FaPlay />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Marquer comme résolu"
                              >
                                <FaCheckCircle />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleReply(ticket)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Répondre"
                          >
                            <FaReply />
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          setSelectedTicket(null);
        }}
        message={selectedTicket}
        type="support"
        onReply={handleReply}
      />

      {/* Modal de visualisation d'image */}
      {showAttachmentModal && selectedAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowAttachmentModal(false)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAttachmentModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium">{selectedAttachment.name}</h3>
            </div>
            
            <div className="p-4 flex justify-center items-center min-h-[300px] max-h-[70vh] overflow-auto">
              {selectedAttachment.type === 'image' ? (
                <img 
                  src={selectedAttachment.url} 
                  alt={selectedAttachment.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              ) : selectedAttachment.type === 'pdf' ? (
                <iframe 
                  src={selectedAttachment.url} 
                  title={selectedAttachment.name}
                  className="w-full h-[60vh]"
                />
              ) : (
                <div className="text-center">
                  <FaFile className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Aperçu non disponible</p>
                  <button
                    onClick={() => handleDownload(selectedAttachment.id, selectedAttachment.name)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Télécharger le fichier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de réponse */}
      <AdminReplyModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedTicket(null);
        }}
        message={selectedTicket}
        type="support"
        onReplySent={() => {
          fetchTickets();
          fetchStats();
        }}
      />
    </div>
  );
};

export default SupportTickets;