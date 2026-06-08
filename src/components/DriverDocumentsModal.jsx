import React from "react";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaFileAlt,
  FaBuilding,
  FaCarAlt,
  FaShieldAlt,
  FaIdCard,
  FaRegIdCard,
  FaFileContract,
  FaAddressCard,
  FaCalendar,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { API_BASE_URL } from "../api/axiosConfig"; // IMPORTANT: importer l'URL

// Configuration des documents (inchangée)
const DOCUMENTS_CONFIG = [
  {
    key: "kbis_file",
    label: "KBIS (Extrait K-Bis)",
    icon: FaBuilding,
    description: "Extrait d'immatriculation de l'entreprise",
    required: true,
  },
  {
    key: "vtc_registration_file",
    label: "Carte VTC",
    icon: FaRegIdCard,
    description: "Carte professionnelle VTC",
    required: true,
  },
  {
    key: "rcpro_insurance_file",
    label: "Assurance RC Pro",
    icon: FaShieldAlt,
    description: "Responsabilité civile professionnelle",
    required: true,
    hasExpiry: true,
    expiryKey: "rcpro_insurance_expiry",
  },
  {
    key: "vehicle_insurance_file",
    label: "Assurance Véhicule",
    icon: FaCarAlt,
    description: "Assurance du véhicule",
    required: true,
    hasExpiry: true,
    expiryKey: "vehicle_insurance_expiry",
  },
  {
    key: "vtc_card_file",
    label: "Carte VTC Complémentaire",
    icon: FaIdCard,
    description: "Carte VTC complémentaire",
    required: true,
  },
  {
    key: "driver_license_file",
    label: "Permis de Conduire",
    icon: FaRegIdCard,
    description: "Permis de conduire valide",
    required: true,
  },
  {
    key: "car_registration_file",
    label: "Carte Grise",
    icon: FaFileContract,
    description: "Certificat d'immatriculation",
    required: true,
  },
  {
    key: "identity_card_file",
    label: "Pièce d'Identité",
    icon: FaAddressCard,
    description: "Carte d'identité ou passeport",
    required: true,
  },
  {
    key: "vehicle_photo_file",
    label: "Photo du Véhicule",
    icon: FaCarAlt,
    description: "Photo récente du véhicule",
    required: true,
    isImage: true,
  },
];

const DriverDocumentsModal = ({ driver, onClose }) => {
  // Utiliser l'URL depuis axiosConfig
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    // Nettoyer le chemin
    let cleanPath = filePath;
    if (cleanPath.startsWith('public/')) {
      cleanPath = cleanPath.replace('public/', '');
    }
    if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath;
    }
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      alert("Erreur lors du téléchargement du fichier");
    }
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return FaFileAlt;
    const extension = filePath.split(".").pop().toLowerCase();
    if (extension === "pdf") return FaFileAlt;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return FaFileAlt;
    return FaFileAlt;
  };

  const getExpiryDate = (expiryKey) => {
    return driver.driver_detail?.[expiryKey];
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const hasDocument = (docKey) => {
    return !!driver.driver_detail?.[docKey];
  };

  const totalDocuments = DOCUMENTS_CONFIG.length;
  const uploadedDocuments = DOCUMENTS_CONFIG.filter((doc) =>
    hasDocument(doc.key)
  ).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaFileAlt className="w-6 h-6 mr-3 text-purple-600" />
              Documents du chauffeur
              <span className="ml-3 text-sm font-normal text-gray-500">
                {driver.name}
              </span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progression des documents
              </span>
              <span className="text-sm text-gray-500">
                {uploadedDocuments}/{totalDocuments}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadedDocuments / totalDocuments) * 100}%` }}
              />
            </div>
          </div>

          {/* Grille des documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCUMENTS_CONFIG.map((doc) => {
              const filePath = driver.driver_detail?.[doc.key];
              const hasFile = !!filePath;
              const expiryDate = doc.hasExpiry
                ? getExpiryDate(doc.expiryKey)
                : null;
              const isExpiredDoc = expiryDate ? isExpired(expiryDate) : false;

              return (
                <div
                  key={doc.key}
                  className={`border rounded-lg p-4 transition-all ${
                    hasFile
                      ? "bg-white hover:shadow-md"
                      : "bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <doc.icon className="w-8 h-8 text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {doc.label}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                    {hasFile ? (
                      <MdVerified className="w-5 h-5 text-green-500" />
                    ) : (
                      <FaTimes className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  {hasFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaFileAlt className="w-4 h-4 mr-2" />
                        <span className="truncate flex-1">
                          {filePath.split("/").pop()}
                        </span>
                      </div>

                      {expiryDate && (
                        <div className="flex items-center text-xs">
                          <FaCalendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span
                            className={
                              isExpiredDoc
                                ? "text-red-600 font-medium"
                                : "text-gray-500"
                            }
                          >
                            Expire le:{" "}
                            {new Date(expiryDate).toLocaleDateString()}
                            {isExpiredDoc && " ⚠️ EXPIRÉ"}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-3">
                        <a
                          href={getFileUrl(filePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 text-sm transition-colors"
                        >
                          <FaEye className="w-4 h-4 mr-1" />
                          Voir
                        </a>
                        <button
                          onClick={() =>
                            downloadFile(
                              getFileUrl(filePath),
                              `${driver.name}_${doc.label}_${
                                filePath.split("/").pop()
                              }`
                            )
                          }
                          className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm transition-colors"
                        >
                          <FaDownload className="w-4 h-4 mr-1" />
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Document non fourni
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pied de page */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {uploadedDocuments} documents sur {totalDocuments} fournis
            </div>
            <button
              onClick={() => {
                DOCUMENTS_CONFIG.forEach((doc) => {
                  const filePath = driver.driver_detail?.[doc.key];
                  if (filePath) {
                    downloadFile(
                      getFileUrl(filePath),
                      `${driver.name}_${doc.label}_${filePath.split("/").pop()}`
                    );
                  }
                });
              }}
              className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaDownload className="w-4 h-4 inline mr-2" />
              Télécharger tout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDocumentsModal;