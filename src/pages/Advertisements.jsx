import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaImage,
  FaSort,
} from "react-icons/fa";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import { API_BASE_URL } from "../api/axiosConfig";
import Swal from "sweetalert2";

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    badge_color: "#27a421",
    link: "",
    is_active: 1,
    order: 0,
    start_date: "",
    end_date: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Utiliser useCallback pour éviter les re-rendus infinis
  const fetchAdvertisements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAdvertisements();
      if (response.data.success) {
        setAdvertisements(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les annonces",
        confirmButtonColor: "#27a421",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  const handleOpenModal = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description,
        badge: ad.badge,
        badge_color: ad.badge_color,
        link: ad.link,
        is_active: ad.is_active ? 1 : 0,
        order: ad.order,
        start_date: ad.start_date || "",
        end_date: ad.end_date || "",
        image: null,
      });
      setImagePreview(getImageUrl(ad.image));
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        description: "",
        badge: "",
        badge_color: "#27a421",
        link: "",
        is_active: 1,
        order: advertisements.length,
        start_date: "",
        end_date: "",
        image: null,
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAd(null);
    setFormData({
      title: "",
      description: "",
      badge: "",
      badge_color: "#27a421",
      link: "",
      is_active: 1,
      order: 0,
      start_date: "",
      end_date: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "L'image ne doit pas dépasser 5MB",
          confirmButtonColor: "#27a421",
        });
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Format d'image non supporté. Utilisez JPG, PNG ou GIF",
          confirmButtonColor: "#27a421",
        });
        return;
      }
      
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le titre est requis",
        confirmButtonColor: "#27a421",
      });
      return;
    }
    if (!formData.description.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "La description est requise",
        confirmButtonColor: "#27a421",
      });
      return;
    }
    if (!formData.badge.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le badge est requis",
        confirmButtonColor: "#27a421",
      });
      return;
    }
    if (!formData.link.trim()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le lien est requis",
        confirmButtonColor: "#27a421",
      });
      return;
    }
    
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
        if (key === 'is_active') {
          submitData.append(key, formData[key] ? 1 : 0);
        } else if (key === 'image' && formData[key] instanceof File) {
          submitData.append(key, formData[key]);
        } else if (key !== 'image') {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      let response;
      if (editingAd) {
        response = await adminAPI.updateAdvertisement(editingAd.id, submitData);
      } else {
        response = await adminAPI.createAdvertisement(submitData);
      }

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: editingAd ? "Annonce modifiée avec succès" : "Annonce créée avec succès",
          confirmButtonColor: "#27a421",
        });
        handleCloseModal();
        fetchAdvertisements();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        Swal.fire({
          icon: "error",
          title: "Erreur de validation",
          text: errors.join("\n"),
          confirmButtonColor: "#27a421",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.response?.data?.message || "Une erreur est survenue",
          confirmButtonColor: "#27a421",
        });
      }
    }
  };

  const handleDelete = async (ad) => {
    const result = await Swal.fire({
      title: "Supprimer l'annonce",
      text: `Êtes-vous sûr de vouloir supprimer "${ad.title}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      reverseButtons: false,
      buttonsStyling: true,
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await adminAPI.deleteAdvertisement(ad.id);
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Supprimé!",
            text: "L'annonce a été supprimée.",
            confirmButtonColor: "#27a421",
          });
          fetchAdvertisements();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de supprimer l'annonce",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      const response = await adminAPI.toggleAdvertisementActive(ad.id);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: ad.is_active ? "Annonce désactivée" : "Annonce activée",
          confirmButtonColor: "#27a421",
          timer: 2000,
          showConfirmButton: true,
        });
        fetchAdvertisements();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de changer le statut",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    if (draggedItem !== index) {
      const newAds = [...advertisements];
      const draggedAd = newAds[draggedItem];
      newAds.splice(draggedItem, 1);
      newAds.splice(index, 0, draggedAd);
      
      const updatedAds = newAds.map((ad, idx) => ({ ...ad, order: idx }));
      setAdvertisements(updatedAds);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = async () => {
    if (draggedItem !== null) {
      const orderData = advertisements.map((ad, idx) => ({
        id: ad.id,
        order: idx,
      }));
      
      try {
        await adminAPI.updateAdvertisementsOrder(orderData);
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Ordre des annonces mis à jour",
          confirmButtonColor: "#27a421",
          timer: 2000,
        });
        fetchAdvertisements();
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'ordre:", error);
        fetchAdvertisements();
      }
    }
    setDraggedItem(null);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
        Inactive
      </span>
    );
  };

  // Gérer l'erreur de chargement d'image sans déclencher de re-rendu
  const handleImageError = (adId) => {
    if (!imageErrors[adId]) {
      setImageErrors(prev => ({ ...prev, [adId]: true }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Annonces publicitaires
              </h1>
              <p className="mt-1 text-gray-600">
                Gérez les annonces affichées sur l'application
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Nouvelle annonce
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ordre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Badge
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {advertisements.map((ad, index) => (
                      <tr
                        key={ad.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-move hover:bg-gray-50 transition-colors ${
                          draggedItem === index ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaSort className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {ad.order}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ad.image && !imageErrors[ad.id] ? (
                            <img
                              src={getImageUrl(ad.image)}
                              alt={ad.title}
                              className="w-12 h-12 object-cover rounded"
                              onError={() => handleImageError(ad.id)}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <FaImage className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {ad.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs font-semibold text-white rounded-full"
                            style={{ backgroundColor: ad.badge_color }}
                          >
                            {ad.badge}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(ad.is_active)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ad.start_date && (
                            <div>Début: {new Date(ad.start_date).toLocaleDateString()}</div>
                          )}
                          {ad.end_date && (
                            <div>Fin: {new Date(ad.end_date).toLocaleDateString()}</div>
                          )}
                          {!ad.start_date && !ad.end_date && (
                            <span className="text-gray-400">Permanent</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleToggleActive(ad)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title={ad.is_active ? "Désactiver" : "Activer"}
                          >
                            {ad.is_active ? (
                              <FaToggleOn className="w-5 h-5" />
                            ) : (
                              <FaToggleOff className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenModal(ad)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Modifier"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {advertisements.length === 0 && (
                <div className="text-center py-12">
                  <FaImage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Aucune annonce pour le moment</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="mt-4 text-green-600 hover:text-green-700"
                  >
                    Créer votre première annonce
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Modal de création/édition */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingAd ? "Modifier l'annonce" : "Nouvelle annonce"}
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Badge *
                      </label>
                      <input
                        type="text"
                        name="badge"
                        value={formData.badge}
                        onChange={handleInputChange}
                        required
                        placeholder="ex: Promo, Nouveau, Urgent"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur du badge *
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          name="badge_color"
                          value={formData.badge_color}
                          onChange={handleInputChange}
                          required
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          name="badge_color"
                          value={formData.badge_color}
                          onChange={handleInputChange}
                          required
                          pattern="^#[A-Fa-f0-9]{6}$"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lien *
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      required
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début (optionnel)
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin (optionnel)
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image (max 5MB)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mx-auto h-32 w-auto object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData({ ...formData, image: null });
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </button>
                          </div>
                        ) : (
                          <>
                            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="image-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                              >
                                <span>Télécharger une image</span>
                                <input
                                  id="image-upload"
                                  name="image"
                                  type="file"
                                  className="sr-only"
                                  accept="image/jpeg,image/png,image/jpg,image/gif"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF jusqu'à 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active === 1}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Active (visible sur l'application)
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingAd ? "Mettre à jour" : "Créer l'annonce"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Advertisements;