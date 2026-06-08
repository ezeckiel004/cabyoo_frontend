import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DriverDetailsModal from "../components/DriverDetailsModal";
import DriverDocumentsModal from "../components/DriverDocumentsModal";
import { adminAPI } from "../api/admin";
import {
  FaCheck,
  FaTimes,
  FaCar,
  FaIdCard,
  FaUser,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaFileAlt,
  FaCarAlt,
  FaPalette,
  FaStar,
  FaClock,
} from "react-icons/fa";

const PendingDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState(20);

  useEffect(() => {
    fetchPendingDrivers();
    const interval = setInterval(fetchPendingDrivers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingDrivers();
      let driversData = [];
      if (response.data.drivers?.data) driversData = response.data.drivers.data;
      else if (response.data.drivers) driversData = response.data.drivers;
      else if (Array.isArray(response.data)) driversData = response.data;
      else if (response.data.data) driversData = response.data.data;
      
      setDrivers(driversData);
      window.dispatchEvent(new Event("refreshPendingDrivers"));
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement des chauffeurs en attente");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedDriver) return;
    try {
      await adminAPI.approveDriver(selectedDriver.id, {
        notes: approveNotes || "Approuvé via dashboard",
        commission_rate: commissionRate,
      });
      alert("✅ Chauffeur approuvé avec succès !");
      setShowApproveModal(false);
      setApproveNotes("");
      setCommissionRate(20);
      fetchPendingDrivers();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de l'approbation");
    }
  };

  const handleReject = async () => {
    if (!selectedDriver || !rejectReason.trim()) {
      alert("Veuillez indiquer une raison de rejet");
      return;
    }
    try {
      await adminAPI.rejectDriver(selectedDriver.id, {
        reason: rejectReason,
        permanent_block: false,
      });
      alert("❌ Chauffeur rejeté avec succès !");
      setShowRejectModal(false);
      setRejectReason("");
      fetchPendingDrivers();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors du rejet");
    }
  };

  const openApproveModal = (driver) => {
    setSelectedDriver(driver);
    setShowApproveModal(true);
  };

  const openRejectModal = (driver) => {
    setSelectedDriver(driver);
    setShowRejectModal(true);
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const handleViewDocuments = (driver) => {
    setSelectedDriver(driver);
    setShowDocumentsModal(true);
  };

  const getDocumentStatus = (driver) => {
    const driverDetail = driver.driver_detail || {};
    const hasLicense = driverDetail.driver_license;
    const hasCarInfo = driverDetail.car_model && driverDetail.car_plate;
    if (hasLicense && hasCarInfo) {
      return { text: "Complet", color: "text-green-600", bg: "bg-green-100" };
    } else if (hasLicense || hasCarInfo) {
      return { text: "Partiel", color: "text-yellow-600", bg: "bg-yellow-100" };
    }
    return { text: "Manquant", color: "text-red-600", bg: "bg-red-100" };
  };

  const formatDaysWaiting = (days) => {
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chauffeurs en attente
              </h1>
              <p className="text-gray-600 mt-1">
                Valider ou rejeter les inscriptions des chauffeurs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <span className="text-yellow-800 font-medium">
                  {drivers.length} chauffeur(s) en attente
                </span>
              </div>
              <button
                onClick={fetchPendingDrivers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaEye className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-center py-12">
                <FaCar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun chauffeur en attente
                </h3>
                <p className="text-gray-500">
                  Toutes les demandes ont été traitées.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chauffeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Véhicule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date demande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => {
                      const docStatus = getDocumentStatus(driver);
                      return (
                        <tr key={driver.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-green-600 w-5 h-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {driver.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {driver.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {driver.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900">
                                <FaCarAlt className="w-4 h-4 mr-2 text-gray-400" />
                                {driver.driver_detail?.car_model || "Non spécifié"}
                              </div>
                              <div className="text-gray-500">
                                {driver.driver_detail?.car_plate || "Pas de plaque"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${docStatus.bg} ${docStatus.color}`}
                              >
                                <FaFileAlt className="w-3 h-3 mr-1" />
                                {docStatus.text}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900">
                                <FaCalendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(driver.created_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-500 mt-1">
                                <FaClock className="w-3 h-3 mr-1" />
                                {formatDaysWaiting(driver.days_waiting || 0)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(driver)}
                                className="bg-blue-100 text-blue-700 p-2 rounded-md hover:bg-blue-200"
                                title="Voir détails"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleViewDocuments(driver)}
                                className="bg-purple-100 text-purple-700 p-2 rounded-md hover:bg-purple-200"
                                title="Voir documents"
                              >
                                <FaFileAlt />
                              </button>
                              <button
                                onClick={() => openApproveModal(driver)}
                                className="bg-green-100 text-green-700 p-2 rounded-md hover:bg-green-200"
                                title="Approuver"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => openRejectModal(driver)}
                                className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200"
                                title="Rejeter"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          onClose={() => setShowDetailsModal(false)}
          onApprove={() => {
            setShowDetailsModal(false);
            openApproveModal(selectedDriver);
          }}
          onReject={() => {
            setShowDetailsModal(false);
            openRejectModal(selectedDriver);
          }}
          onViewDocuments={() => {
            setShowDetailsModal(false);
            handleViewDocuments(selectedDriver);
          }}
        />
      )}

      {showDocumentsModal && selectedDriver && (
        <DriverDocumentsModal
          driver={selectedDriver}
          onClose={() => setShowDocumentsModal(false)}
        />
      )}

      {/* Modal Approbation */}
      {showApproveModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Approuver le chauffeur</h3>
            <div className="mb-4">
              <p className="font-medium">{selectedDriver.name}</p>
              <p className="text-sm text-gray-600">
                {selectedDriver.driver_detail?.car_model} - {selectedDriver.driver_detail?.car_plate}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Taux de commission (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
                max="100"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Notes optionnelles..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowApproveModal(false)} className="px-4 py-2 border rounded-lg">
                Annuler
              </button>
              <button onClick={handleApprove} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {showRejectModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Rejeter la demande</h3>
            <div className="mb-4">
              <p className="font-medium">{selectedDriver.name}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Raison du rejet *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border rounded-lg">
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className={`px-4 py-2 rounded-lg ${!rejectReason.trim() ? "bg-gray-300" : "bg-red-600 text-white"}`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDrivers;