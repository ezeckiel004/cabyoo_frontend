// src/components/AdminReplyModal.jsx
import React, { useState } from "react";
import { FaTimes, FaPaperPlane, FaEnvelope, FaUser } from "react-icons/fa";
import { adminAPI } from "../api/admin";

const AdminReplyModal = ({ isOpen, onClose, message, type, onReplySent }) => {
  const [replyData, setReplyData] = useState({
    subject: "",
    reply_message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (message) {
      if (type === "contact") {
        setReplyData({
          subject: `Re: ${message.subject}`,
          reply_message: ""
        });
      } else {
        setReplyData({
          subject: `Ticket #${message.id} - Support CABYOO`,
          reply_message: ""
        });
      }
    }
  }, [message, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (type === "contact") {
        response = await adminAPI.replyToContactMessage(message.id, replyData);
      } else {
        response = await adminAPI.replyToSupportTicket(message.id, replyData);
      }

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onReplySent();
          onClose();
          setSuccess(false);
          setReplyData({ subject: "", reply_message: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi de la réponse");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FaEnvelope className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">
              Répondre à {type === "contact" ? "un message" : "un ticket"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <FaPaperPlane className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réponse envoyée !</h3>
              <p className="text-gray-600">L'utilisateur a reçu votre réponse par email.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet
                </label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre réponse
                </label>
                <textarea
                  value={replyData.reply_message}
                  onChange={(e) => setReplyData({ ...replyData, reply_message: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Écrivez votre réponse ici..."
                  required
                />
              </div>

              {message && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {type === "contact" ? message.name : message.user_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "{type === "contact" ? message.message : message.message}"
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Envoyer la réponse
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminReplyModal;