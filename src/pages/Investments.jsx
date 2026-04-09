// src/pages/Investments.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaMoneyBillWave,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaArchive,
  FaTrash,
  FaDownload,
  FaChartLine,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const Investments = () => {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ status: "", admin_notes: "" });
  const [updating, setUpdating] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    date_from: "",
    date_to: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, [filters, pagination.current_page]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...filters,
      };
      // Filtrer les valeurs vides
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      // Utiliser adminAPI au lieu de axiosInstance
      const response = await adminAPI.getInvestments(params);
      console.log("Investments response:", response.data);
      
      if (response.data.success) {
        setInvestments(response.data.data.data);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
        });
      } else {
        setInvestments([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des investissements:", error);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Utiliser adminAPI au lieu de axiosInstance
      const response = await adminAPI.getInvestmentsStats();
      console.log("Stats response:", response.data);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    }
  };

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (investment) => {
    setSelectedInvestment(investment);
    setUpdateData({
      status: investment.status,
      admin_notes: investment.admin_notes || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      setUpdating(true);
      const response = await adminAPI.updateInvestment(selectedInvestment.id, updateData);
      
      if (response.data.success) {
        await fetchInvestments();
        await fetchStats();
        setShowUpdateModal(false);
        setSelectedInvestment(null);
        alert("Demande mise à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkContacted = async (id) => {
    try {
      const response = await adminAPI.markInvestmentContacted(id);
      if (response.data.success) {
        await fetchInvestments();
        await fetchStats();
        alert("Demande marquée comme contactée");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'opération");
    }
  };

  const handleArchive = async (id) => {
    if (!confirm("Archiver cette demande ?")) return;
    try {
      const response = await adminAPI.archiveInvestment(id);
      if (response.data.success) {
        await fetchInvestments();
        await fetchStats();
        alert("Demande archivée avec succès");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'archivage");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    try {
      const response = await adminAPI.deleteInvestment(id);
      if (response.data.success) {
        await fetchInvestments();
        await fetchStats();
        alert("Demande supprimée avec succès");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      const response = await adminAPI.exportInvestments(params);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `investissements_${new Date().toISOString().slice(0,19)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      contacted: "bg-blue-100 text-blue-800 border border-blue-200",
      processed: "bg-green-100 text-green-800 border border-green-200",
      archived: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    
    const labels = {
      pending: "En attente",
      contacted: "Contacté",
      processed: "Traité",
      archived: "Archivé",
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getAmountRangeLabel = (range) => {
    const ranges = {
      "5000-10000": "5 000 € - 10 000 €",
      "10000-25000": "10 000 € - 25 000 €",
      "25000-50000": "25 000 € - 50 000 €",
      "50000-100000": "50 000 € - 100 000 €",
      "100000+": "Plus de 100 000 €",
    };
    return ranges[range] || range;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white rounded-lg shadow transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-7 h-7 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* En-tête */}
          <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Demandes d'investissement
              </h1>
              <p className="mt-1 text-gray-600">
                Gérez les demandes d'investissement reçues via le site
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter className="mr-2" />
                Filtres
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <FaDownload className="mr-2" />
                Exporter
              </button>
            </div>
          </div>

          {/* Cartes statistiques */}
          {stats && (
            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard title="Total demandes" value={stats.total || 0} icon={FaMoneyBillWave} color="bg-purple-500" />
              <StatCard title="En attente" value={stats.pending || 0} icon={FaClock} color="bg-yellow-500" />
              <StatCard title="Contactés" value={stats.contacted || 0} icon={FaCheckCircle} color="bg-blue-500" />
              <StatCard title="Traités" value={stats.processed || 0} color="bg-green-500" icon={FaCheckCircle} />
              <StatCard title="Archivés" value={stats.archived || 0} icon={FaArchive} color="bg-gray-500" />
            </div>
          )}

          {/* Filtres */}
          {showFilters && (
            <div className="p-4 mb-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filtres</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, current_page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tous</option>
                    <option value="pending">En attente</option>
                    <option value="contacted">Contacté</option>
                    <option value="processed">Traité</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Recherche</label>
                  <input
                    type="text"
                    placeholder="Nom, email, téléphone..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, current_page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date début</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value, current_page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date fin</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters({ ...filters, date_to: e.target.value, current_page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tableau des investissements */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Demandeur</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <FaSpinner className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
                        <p className="mt-2 text-gray-500">Chargement...</p>
                       </td>
                    </tr>
                  ) : investments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <FaExclamationTriangle className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500">Aucune demande d'investissement</p>
                       </td>
                    </tr>
                  ) : (
                    investments.map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{investment.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{investment.first_name} {investment.last_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{investment.email}</div>
                          <div className="text-xs text-gray-500">{investment.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getAmountRangeLabel(investment.amount_range)}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(investment.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(investment.created_at)}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(investment)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir détails"
                            >
                              <FaEye />
                            </button>
                            {investment.status === "pending" && (
                              <button
                                onClick={() => handleMarkContacted(investment.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Marquer comme contacté"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(investment)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Modifier"
                            >
                              <FaChartLine />
                            </button>
                            {investment.status !== "archived" && (
                              <button
                                onClick={() => handleArchive(investment.id)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Archiver"
                              >
                                <FaArchive />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(investment.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && investments.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Affichage de {(pagination.current_page - 1) * pagination.per_page + 1} à{" "}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total} demandes
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1 text-sm bg-gray-100 rounded-md">
                    Page {pagination.current_page} sur {pagination.last_page}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Détails */}
      {showDetailModal && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
              <h2 className="text-xl font-bold text-gray-800">Détails de la demande #{selectedInvestment.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{selectedInvestment.first_name} {selectedInvestment.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedInvestment.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedInvestment.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant envisagé</p>
                  <p className="font-medium text-green-600">{getAmountRangeLabel(selectedInvestment.amount_range)}</p>
                </div>
                {selectedInvestment.address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium">{selectedInvestment.address}</p>
                  </div>
                )}
                {selectedInvestment.city && (
                  <div>
                    <p className="text-sm text-gray-500">Ville</p>
                    <p className="font-medium">{selectedInvestment.city}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  {getStatusBadge(selectedInvestment.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de soumission</p>
                  <p className="font-medium">{formatDate(selectedInvestment.created_at)}</p>
                </div>
                {selectedInvestment.contacted_at && (
                  <div>
                    <p className="text-sm text-gray-500">Date de contact</p>
                    <p className="font-medium">{formatDate(selectedInvestment.contacted_at)}</p>
                  </div>
                )}
              </div>
              {selectedInvestment.admin_notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes admin</p>
                  <p className="p-3 bg-gray-50 rounded-lg">{selectedInvestment.admin_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Mise à jour */}
      {showUpdateModal && selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Modifier la demande #{selectedInvestment.id}</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Statut</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">En attente</option>
                  <option value="contacted">Contacté</option>
                  <option value="processed">Traité</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Notes admin</label>
                <textarea
                  rows="4"
                  value={updateData.admin_notes}
                  onChange={(e) => setUpdateData({ ...updateData, admin_notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajouter des notes..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updating}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating && <FaSpinner className="w-4 h-4 mr-2 animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;