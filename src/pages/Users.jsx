// src\pages\Users.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaUser,
  FaCar,
  FaUserShield,
  FaPlus,
  FaSearch,
  FaIdCard,
  FaCarAlt,
  FaKey,
} from "react-icons/fa";

// Composant modal séparé
const UserModal = ({
  showModal,
  setShowModal,
  modalType,
  selectedUser,
  formData,
  formErrors,
  loading,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  resetForm,
  getRoleBadge,
  getStatusBadge,
  handleEditUser,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {modalType === "view"
                ? "Détails de l'utilisateur"
                : modalType === "edit"
                  ? "Modifier l'utilisateur"
                  : "Créer un nouvel utilisateur"}
            </h3>
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 text-xl"
              type="button"
            >
              ✕
            </button>
          </div>

          {modalType === "view" && selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-blue-600 font-bold">
                    {selectedUser.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status, selectedUser.id)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <p className="mt-1 text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date d'inscription
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedUser.driver_detail && (
                  <div className="md:col-span-2 border-t pt-4">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Informations chauffeur
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Permis de conduire
                        </label>
                        <p className="mt-1">
                          {selectedUser.driver_detail.driver_license}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Véhicule
                        </label>
                        <p className="mt-1">
                          {selectedUser.driver_detail.car_model} -{" "}
                          {selectedUser.driver_detail.car_plate}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Couleur
                        </label>
                        <p className="mt-1">
                          {selectedUser.driver_detail.car_color}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expérience
                        </label>
                        <p className="mt-1">
                          {selectedUser.driver_detail.year_of_experience} an(s)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => {
                    setModalType("edit");
                    handleEditUser(selectedUser);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {(modalType === "edit" || modalType === "create") && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">
                      Informations de base
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="+237 6XX XXX XXX"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {(modalType === "create" || formData.password) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe{" "}
                          {modalType === "create"
                            ? "*"
                            : "(laisser vide pour ne pas changer)"}
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="••••••••"
                          />
                          <FaKey className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {formErrors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.password}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800">Configuration</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            value: "client",
                            label: "Client",
                            icon: FaUser,
                            color: "blue",
                          },
                          {
                            value: "chauffeur",
                            label: "Chauffeur",
                            icon: FaCar,
                            color: "green",
                          },
                          {
                            value: "admin",
                            label: "Admin",
                            icon: FaUserShield,
                            color: "purple",
                          },
                        ].map((role) => {
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() =>
                                handleInputChange({
                                  target: { name: "role", value: role.value },
                                })
                              }
                              className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                                formData.role === role.value
                                  ? `border-${role.color}-500 bg-${role.color}-50`
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 mb-1 ${
                                  formData.role === role.value
                                    ? `text-${role.color}-600`
                                    : "text-gray-400"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  formData.role === role.value
                                    ? `text-${role.color}-600 font-medium`
                                    : "text-gray-600"
                                }`}
                              >
                                {role.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="blocked">Bloqué</option>
                        <option value="on_leave">En congé</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formData.role === "chauffeur" && (
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaCarAlt className="w-5 h-5 mr-2 text-green-600" />
                      Informations chauffeur *
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaIdCard className="inline w-4 h-4 mr-1" />
                          Permis de conduire
                        </label>
                        <input
                          type="text"
                          name="driver_license"
                          value={formData.driver_license}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.driver_license
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="LIC-XXXX-XXXX"
                        />
                        {formErrors.driver_license && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.driver_license}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Années d'expérience
                        </label>
                        <input
                          type="number"
                          name="year_of_experience"
                          value={formData.year_of_experience}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Modèle du véhicule
                        </label>
                        <input
                          type="text"
                          name="car_model"
                          value={formData.car_model}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.car_model
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Toyota Camry"
                        />
                        {formErrors.car_model && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.car_model}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plaque d'immatriculation
                        </label>
                        <input
                          type="text"
                          name="car_plate"
                          value={formData.car_plate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.car_plate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="CE-123-AB"
                        />
                        {formErrors.car_plate && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.car_plate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Couleur du véhicule
                        </label>
                        <input
                          type="text"
                          name="car_color"
                          value={formData.car_color}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.car_color
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Noir"
                        />
                        {formErrors.car_color && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.car_color}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        {modalType === "create"
                          ? "Création..."
                          : "Mise à jour..."}
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4 mr-2" />
                        {modalType === "create"
                          ? "Créer l'utilisateur"
                          : "Mettre à jour"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // view, edit, create
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
    status: "active",
    driver_license: "",
    car_model: "",
    car_plate: "",
    car_color: "",
    year_of_experience: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === "clients") {
        response = await adminAPI.getClients();
      } else if (activeTab === "drivers") {
        response = await adminAPI.getDrivers();
      } else {
        response = await adminAPI.getUsers();
      }
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Effacer l'erreur pour ce champ s'il y en a une
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email invalide";
    }
    if (!formData.phone.trim()) errors.phone = "Le téléphone est requis";

    // Validation mot de passe uniquement en création
    if (modalType === "create" && !formData.password) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Minimum 6 caractères";
    }

    if (formData.role === "chauffeur") {
      if (!formData.driver_license.trim())
        errors.driver_license = "Le permis est requis";
      if (!formData.car_model.trim()) errors.car_model = "Le modèle est requis";
      if (!formData.car_plate.trim())
        errors.car_plate = "La plaque est requise";
      if (!formData.car_color.trim())
        errors.car_color = "La couleur est requise";
    }

    return errors;
  };

  const handleCreateUser = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      setLoading(true);

      // Préparer les données
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        status: formData.status,
      };

      // Ajouter les infos chauffeur si nécessaire
      if (formData.role === "chauffeur") {
        userData.driver_license = formData.driver_license;
        userData.car_model = formData.car_model;
        userData.car_plate = formData.car_plate;
        userData.car_color = formData.car_color;
        userData.year_of_experience =
          parseInt(formData.year_of_experience) || 0;
      }

      console.log("Données envoyées:", userData);

      // Utiliser la nouvelle API - CORRECTION ICI
      await adminAPI.createUser(userData);

      alert(
        `${formData.role === "client" ? "Client" : formData.role === "chauffeur" ? "Chauffeur" : "Admin"} créé avec succès !`,
      );
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Erreur détaillée:", error);

      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const validationErrors = errorData.errors;
          let errorMessage = "Erreurs de validation:\n";
          Object.keys(validationErrors).forEach((key) => {
            errorMessage += `• ${validationErrors[key].join(", ")}\n`;
          });
          alert(errorMessage);
        } else {
          const errorMsg =
            errorData.message ||
            errorData.error ||
            "Erreur lors de la création";
          alert(`Erreur: ${errorMsg}`);
        }
      } else if (error.request) {
        alert("Pas de réponse du serveur. Vérifiez votre connexion.");
      } else {
        alert(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await adminAPI.updateUser(selectedUser.id, updateData);
      alert("Utilisateur mis à jour avec succès !");
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "client",
      status: "active",
      driver_license: "",
      car_model: "",
      car_plate: "",
      car_color: "",
      year_of_experience: 0,
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType("view");
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType("edit");
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "client",
      status: user.status || "active",
      driver_license: user.driver_detail?.driver_license || "",
      car_model: user.driver_detail?.car_model || "",
      car_plate: user.driver_detail?.car_plate || "",
      car_color: user.driver_detail?.car_color || "",
      year_of_experience: user.driver_detail?.year_of_experience || 0,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `Voulez-vous vraiment supprimer l'utilisateur "${userName}" ?`,
      )
    ) {
      try {
        await adminAPI.deleteUser(userId);
        alert("Utilisateur supprimé avec succès");
        fetchUsers();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    const statusLabels = {
      active: "actif",
      inactive: "inactif",
      blocked: "bloqué",
      on_leave: "en congé",
    };
    if (
      window.confirm(
        `Voulez-vous changer le statut en "${statusLabels[newStatus]}" ?`,
      )
    ) {
      try {
        await adminAPI.updateUserStatus(userId, { status: newStatus });
        alert("Statut mis à jour avec succès");
        fetchUsers();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la mise à jour");
      }
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      client: "bg-blue-100 text-blue-800",
      chauffeur: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    };
    const icons = {
      client: FaUser,
      chauffeur: FaCar,
      admin: FaUserShield,
    };
    const Icon = icons[role] || FaUser;
    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${badges[role]}`}
        >
          <Icon className="w-3 h-3 mr-1" />
          {role === "chauffeur" ? "Chauffeur" : role}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status, userId) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      blocked: "bg-red-100 text-red-800",
      on_leave: "bg-gray-100 text-gray-800",
    };
    const statusText = {
      active: "Actif",
      inactive: "Inactif",
      blocked: "Bloqué",
      on_leave: "En congé",
    };
    return (
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            badges[status] || "bg-gray-100"
          }`}
        >
          {statusText[status]}
        </span>
        <select
          value={status}
          onChange={(e) => handleStatusChange(userId, e.target.value)}
          className="text-xs border rounded p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="blocked">Bloqué</option>
          <option value="on_leave">En congé</option>
        </select>
      </div>
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === "create") {
      handleCreateUser(e);
    } else {
      handleUpdateUser(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestion des utilisateurs
            </h1>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                setSelectedUser(null);
                setModalType("create");
                setShowModal(true);
              }}
              type="button"
            >
              <FaPlus className="mr-2" />
              Nouvel utilisateur
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {["all", "clients", "drivers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  type="button"
                >
                  {tab === "all"
                    ? "Tous"
                    : tab === "clients"
                      ? "Clients"
                      : "Chauffeurs"}
                  <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                    {
                      users.filter((u) =>
                        tab === "all"
                          ? true
                          : u.role ===
                            (tab === "clients" ? "client" : "chauffeur"),
                      ).length
                    }
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun utilisateur trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Aucun résultat pour votre recherche"
                    : "Aucun utilisateur dans cette catégorie"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
                              onClick={() => handleViewUser(user)}
                            >
                              <span className="text-blue-600 font-semibold">
                                {user.name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div
                                className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                onClick={() => handleViewUser(user)}
                              >
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status, user.id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir détails"
                              type="button"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-green-600 hover:text-green-900"
                              title="Modifier"
                              type="button"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(user.id, user.name)
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                              type="button"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        selectedUser={selectedUser}
        formData={formData}
        formErrors={formErrors}
        loading={loading}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        getRoleBadge={getRoleBadge}
        getStatusBadge={getStatusBadge}
        handleEditUser={handleEditUser}
      />
    </div>
  );
};

export default Users;
