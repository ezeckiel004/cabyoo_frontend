import React from "react";
import {
  FaCar,
  FaUser,
  FaCalendar,
  FaPhone,
  FaEnvelope,
  FaCarAlt,
  FaPalette,
  FaMoneyBillWave,
  FaIdCard,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";

const DriverDetailsModal = ({ driver, onClose, onApprove, onReject, onViewDocuments }) => {
  const formatDaysWaiting = (days) => {
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  const getDocumentStatus = () => {
    const driverDetail = driver.driver_detail || {};
    const requiredDocs = [
      "kbis_file",
      "vtc_registration_file",
      "rcpro_insurance_file",
      "vehicle_insurance_file",
      "vtc_card_file",
      "driver_license_file",
      "car_registration_file",
      "identity_card_file",
      "vehicle_photo_file",
    ];
    const presentDocs = requiredDocs.filter((doc) => driverDetail[doc]);
    const percentage = (presentDocs.length / requiredDocs.length) * 100;

    if (presentDocs.length === requiredDocs.length) {
      return { text: "Complet", color: "text-green-600", bg: "bg-green-100", percentage };
    } else if (presentDocs.length >= requiredDocs.length / 2) {
      return { text: "Partiel", color: "text-yellow-600", bg: "bg-yellow-100", percentage };
    } else {
      return { text: "Manquant", color: "text-red-600", bg: "bg-red-100", percentage };
    }
  };

  const docStatus = getDocumentStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCar className="w-6 h-6 mr-3 text-green-600" />
              Détails du chauffeur en attente
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations personnelles et véhicule */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
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
                      <span className="font-medium">{driver.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaEnvelope className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{driver.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaPhone className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{driver.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'inscription
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaCalendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>
                        {new Date(driver.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations véhicule */}
              <div className="bg-gray-50 rounded-lg p-6">
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
                        {driver.driver_detail?.car_model || "Non spécifié"}
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
                        {driver.driver_detail?.car_plate || "Non spécifié"}
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
                        {driver.driver_detail?.car_color || "Non spécifié"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de places
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaCar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{driver.driver_detail?.car_seats || 4}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix de base
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaMoneyBillWave className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{driver.driver_detail?.base_price || 45}€</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix au km
                    </label>
                    <div className="flex items-center p-3 bg-white border border-gray-300 rounded-lg">
                      <FaMoneyBillWave className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{driver.driver_detail?.price_per_km || 2.50}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statut et actions */}
            <div>
              <div className="bg-blue-50 rounded-lg p-6 sticky top-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2" />
                  Statut de la demande
                </h4>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </div>
                    <div className="text-yellow-600 font-bold flex items-center">
                      <MdPending className="w-5 h-5 mr-2" />
                      EN ATTENTE
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      En attente depuis{" "}
                      {formatDaysWaiting(driver.days_waiting || 0).toLowerCase()}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Documents
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${docStatus.bg} ${docStatus.color}`}
                    >
                      {docStatus.text}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          docStatus.percentage === 100
                            ? "bg-green-500"
                            : docStatus.percentage >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${docStatus.percentage}%` }}
                      />
                    </div>
                    <button
                      onClick={onViewDocuments}
                      className="mt-3 w-full flex items-center justify-center bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 text-sm"
                    >
                      <FaFileAlt className="w-4 h-4 mr-2" />
                      Voir tous les documents
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={onApprove}
                      className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaCheck className="w-5 h-5 mr-2" />
                      Approuver ce chauffeur
                    </button>

                    <button
                      onClick={onReject}
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
  );
};

export default DriverDetailsModal;