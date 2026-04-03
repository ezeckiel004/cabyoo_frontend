import React from "react";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaReply, FaCheck, FaPaperPlane } from "react-icons/fa";

const MessageDetailModal = ({ isOpen, onClose, message, type, onReply }) => {
  if (!isOpen || !message) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("fr-FR");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            {type === "contact" ? "Détails du message" : "Détails du ticket"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Nom / Type</p>
                <p className="font-medium">
                  {type === "contact" ? message.name : 
                    message.user_type === "passenger" ? "Passager" :
                    message.user_type === "driver" ? "Chauffeur" : "Partenaire"}
                </p>
              </div>
            </div>
            
            {type === "contact" ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{message.email}</p>
                  </div>
                </div>
                {message.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="font-medium">{message.phone}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="font-medium">{message.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Date d'envoi</p>
                <p className="font-medium">{formatDate(message.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Sujet / Motif */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">
              {type === "contact" ? "Sujet" : "Motif"}
            </p>
            <p className="font-medium">
              {type === "contact" ? message.subject : message.concern_type}
            </p>
          </div>

          {/* Message */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Message</p>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Réponse de l'admin (si existante) */}
          {message.admin_reply && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FaReply className="w-4 h-4 text-green-600" />
                <p className="text-xs font-semibold text-green-700">Votre réponse</p>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.admin_reply}</p>
              {message.replied_at && (
                <p className="text-xs text-gray-500 mt-2">
                  Envoyée le {formatDate(message.replied_at)}
                </p>
              )}
            </div>
          )}

          {/* Statut */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500">Statut</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1
                ${message.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                  message.status === 'processed' ? 'bg-green-100 text-green-800' :
                  message.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'}`}
              >
                {message.status === 'pending' ? 'En attente' :
                 message.status === 'read' ? 'Lu' :
                 message.status === 'processed' ? 'Traité' :
                 message.status === 'resolved' ? 'Résolu' :
                 message.status === 'in_progress' ? 'En cours' :
                 message.status}
              </span>
            </div>
            
            {type === "support" && message.priority && (
              <div>
                <p className="text-xs text-gray-500">Priorité</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1
                  ${message.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}
                >
                  {message.priority === 'urgent' ? '⚠️ Urgent' : 'Normal'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              onClose();
              onReply && onReply(message);
            }}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <FaPaperPlane />
            Répondre
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;