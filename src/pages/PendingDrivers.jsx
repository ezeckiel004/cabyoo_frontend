import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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
  FaInfoCircle,
} from "react-icons/fa";

const PendingDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingDrivers();
      setDrivers(response.data.drivers?.data || response.data || []);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement des chauffeurs en attente");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const handleApprove = async () => {
    if (!selectedDriver) return;

    if (
      !approveNotes.trim() &&
      !window.confirm("Approuver sans ajouter de notes ?")
    ) {
      return;
    }

    try {
      await adminAPI.approveDriver(selectedDriver.id, {
        notes: approveNotes || "Approuvé via dashboard",
        commission_rate: 20,
      });

      alert("Chauffeur approuvé avec succès !");
      setShowApproveModal(false);
      setApproveNotes("");
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

      alert("Chauffeur rejeté avec succès !");
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

  const getDocumentStatus = (driver) => {
    const hasLicense = driver.driver_detail?.driver_license;
    const hasCarInfo =
      driver.driver_detail?.car_model && driver.driver_detail?.car_plate;
    const hasContactInfo = driver.email && driver.phone;

    if (hasLicense && hasCarInfo && hasContactInfo) {
      return { text: "Complet", color: "text-green-600", bg: "bg-green-100" };
    } else if (hasLicense || hasCarInfo) {
      return { text: "Partiel", color: "text-yellow-600", bg: "bg-yellow-100" };
    } else {
      return { text: "Manquant", color: "text-red-600", bg: "bg-red-100" };
    }
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
                        Statut
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
                              <div
                                className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => handleViewDetails(driver)}
                              >
                                <FaUser className="text-green-600 w-6 h-6" />
                              </div>
                              <div className="ml-4">
                                <div
                                  className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                  onClick={() => handleViewDetails(driver)}
                                >
                                  {driver.name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaEnvelope className="w-3 h-3 mr-1" />
                                  {driver.email}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaPhone className="w-3 h-3 mr-1" />
                                  {driver.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900 mb-1">
                                <FaCarAlt className="w-4 h-4 mr-2 text-gray-400" />
                                {driver.driver_detail?.car_model ||
                                  "Non spécifié"}
                              </div>
                              <div className="text-gray-500">
                                {driver.driver_detail?.car_plate ||
                                  "Pas de plaque"}
                              </div>
                              {driver.driver_detail?.car_color && (
                                <div className="text-gray-500 flex items-center mt-1">
                                  <FaPalette className="w-3 h-3 mr-1" />
                                  {driver.driver_detail.car_color}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FaIdCard className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm">
                                  {driver.driver_detail?.driver_license ||
                                    "Permis manquant"}
                                </span>
                              </div>
                              {driver.driver_detail?.year_of_experience > 0 && (
                                <div className="flex items-center">
                                  <FaStar className="w-4 h-4 mr-2 text-yellow-400" />
                                  <span className="text-sm text-gray-600">
                                    {driver.driver_detail.year_of_experience}{" "}
                                    an(s) d'expérience
                                  </span>
                                </div>
                              )}
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${docStatus.bg} ${docStatus.color}`}
                              >
                                <FaFileAlt className="w-3 h-3 mr-1" />
                                {docStatus.text}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  driver.documents_complete
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {driver.documents_complete
                                  ? "Documents OK"
                                  : "Documents incomplets"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900">
                                <FaCalendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(
                                  driver.created_at
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-500 mt-1">
                                <FaClock className="w-3 h-3 mr-1" />
                                {formatDaysWaiting(driver.days_waiting || 0)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleViewDetails(driver)}
                                className="flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 w-full"
                              >
                                <FaEye className="w-4 h-4 mr-2" />
                                Détails
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openApproveModal(driver)}
                                  className="flex-1 flex items-center justify-center bg-green-100 text-green-700 px-3 py-2 rounded-md hover:bg-green-200"
                                >
                                  <FaCheck className="w-4 h-4 mr-1" />
                                  OK
                                </button>
                                <button
                                  onClick={() => openRejectModal(driver)}
                                  className="flex-1 flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200"
                                >
                                  <FaTimes className="w-4 h-4 mr-1" />
                                  Non
                                </button>
                              </div>
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

      {/* Modal Détails du chauffeur */}
      {showDetailsModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaCar className="w-6 h-6 mr-3 text-green-600" />
                  Détails du chauffeur en attente
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations personnelles */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUser className="w-5 h-5 mr-2" />
                      Informations personnelles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="font-medium">
                            {selectedDriver.name}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaEnvelope className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{selectedDriver.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaPhone className="w-4 h-4 mr-3 text-gray-400" />
                          <span>{selectedDriver.phone}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'inscription
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaCalendar className="w-4 h-4 mr-3 text-gray-400" />
                          <span>
                            {new Date(
                              selectedDriver.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations véhicule */}
                  <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaCarAlt className="w-5 h-5 mr-2" />
                      Informations du véhicule
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modèle
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaCarAlt className="w-4 h-4 mr-3 text-gray-400" />
                          <span>
                            {selectedDriver.driver_detail?.car_model ||
                              "Non spécifié"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plaque d'immatriculation
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaIdCard className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="font-mono">
                            {selectedDriver.driver_detail?.car_plate ||
                              "Non spécifié"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Couleur
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaPalette className="w-4 h-4 mr-3 text-gray-400" />
                          <span>
                            {selectedDriver.driver_detail?.car_color ||
                              "Non spécifié"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expérience
                        </label>
                        <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                          <FaStar className="w-4 h-4 mr-3 text-yellow-400" />
                          <span>
                            {selectedDriver.driver_detail?.year_of_experience ||
                              0}{" "}
                            an(s)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut et actions */}
                <div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaInfoCircle className="w-5 h-5 mr-2" />
                      Statut de la demande
                    </h4>

                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Statut
                        </div>
                        <div className="text-yellow-600 font-bold">
                          EN ATTENTE
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          En attente depuis{" "}
                          {formatDaysWaiting(
                            selectedDriver.days_waiting || 0
                          ).toLowerCase()}
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Documents
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            getDocumentStatus(selectedDriver).bg
                          } ${getDocumentStatus(selectedDriver).color}`}
                        >
                          {getDocumentStatus(selectedDriver).text}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {selectedDriver.driver_detail?.driver_license
                            ? "Permis fourni"
                            : "Permis manquant"}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            openApproveModal(selectedDriver);
                          }}
                          className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaCheck className="w-5 h-5 mr-2" />
                          Approuver ce chauffeur
                        </button>

                        <button
                          onClick={() => {
                            setShowDetailsModal(false);
                            openRejectModal(selectedDriver);
                          }}
                          className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="w-5 h-5 mr-2" />
                          Rejeter cette demande
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'approbation */}
      {showApproveModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FaCheck className="inline w-5 h-5 mr-2 text-green-600" />
                Approuver le chauffeur
              </h3>

              <div className="mb-4">
                <div className="font-medium mb-2">{selectedDriver.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedDriver.driver_detail?.car_model} -{" "}
                  {selectedDriver.driver_detail?.car_plate}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ajouter des notes pour l'approbation..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setApproveNotes("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirmer l'approbation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <FaTimes className="inline w-5 h-5 mr-2 text-red-600" />
                Rejeter la demande
              </h3>

              <div className="mb-4">
                <div className="font-medium mb-2">{selectedDriver.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedDriver.driver_detail?.car_model} -{" "}
                  {selectedDriver.driver_detail?.car_plate}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Expliquez pourquoi vous rejetez cette demande..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cette raison sera communiquée au chauffeur.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    !rejectReason.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  Confirmer le rejet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDrivers;
