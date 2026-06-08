import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaTimes,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaArrowLeft,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentAvatarPath, setCurrentAvatarPath] = useState(null);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/storage")) {
      return `${API_BASE_URL}${imagePath}`;
    }
    if (imagePath.startsWith("storage")) {
      return `${API_BASE_URL}/${imagePath}`;
    }
    return `${API_BASE_URL}/storage/${imagePath}`;
  };

  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMe();
      console.log("Profile data:", response.data);
      
      const userData = response.data.user || response.data;
      
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        avatar: userData.avatar || userData.profile_picture || null,
      });
      
      const avatarPath = userData.avatar || userData.profile_picture;
      setCurrentAvatarPath(avatarPath);
      
      if (avatarPath) {
        setAvatarPreview(getFullImageUrl(avatarPath));
      } else {
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      showNotification(
        "error",
        "Erreur de chargement",
        "Impossible de charger les informations du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      showNotification("error", "Format invalide", "Veuillez sélectionner une image");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Fichier trop volumineux", "L'image ne doit pas dépasser 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setProfile((prev) => ({ ...prev, avatar: file }));
    showNotification("info", "Photo modifiée", "N'oubliez pas d'enregistrer les modifications");
  };

  // ✅ Fonction pour supprimer l'avatar
  const deleteAvatar = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre photo de profil ?")) {
      return;
    }
    
    setDeletingAvatar(true);
    
    try {
      const response = await adminAPI.deleteAvatar();
      
      showNotification(
        "success",
        "Photo supprimée !",
        "Votre photo de profil a été supprimée avec succès"
      );
      
      setAvatarPreview(null);
      setCurrentAvatarPath(null);
      setProfile(prev => ({ ...prev, avatar: null }));
      
      if (response.data.user && updateUser) {
        updateUser(response.data.user);
      }
      
      setTimeout(() => {
        fetchProfile();
      }, 1000);
      
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showNotification(
        "error",
        "Erreur",
        error.response?.data?.message || "Impossible de supprimer la photo"
      );
    } finally {
      setDeletingAvatar(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (profile.phone) formData.append("phone", profile.phone);
      if (profile.avatar && profile.avatar instanceof File) {
        formData.append("avatar", profile.avatar);
      }
      
      const response = await adminAPI.updateProfile(formData);
      
      showNotification(
        "success",
        "Profil mis à jour !",
        "Vos informations ont été enregistrées avec succès"
      );
      
      const userData = response.data.user || response.data;
      if (userData && updateUser) {
        updateUser(userData);
      }
      
      setTimeout(() => {
        fetchProfile();
      }, 1500);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        showNotification(
          "error",
          "Erreur de validation",
          "Veuillez corriger les erreurs dans le formulaire"
        );
      } else {
        showNotification(
          "error",
          "Erreur",
          error.response?.data?.message || "Erreur lors de la mise à jour du profil"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    
    if (passwordData.password !== passwordData.password_confirmation) {
      setErrors({ password_confirmation: "Les mots de passe ne correspondent pas" });
      showNotification("error", "Erreur de validation", "Les mots de passe ne correspondent pas");
      setSaving(false);
      return;
    }
    
    if (passwordData.password.length < 8) {
      setErrors({ password: "Le mot de passe doit contenir au moins 8 caractères" });
      showNotification("error", "Mot de passe trop court", "Le mot de passe doit contenir au moins 8 caractères");
      setSaving(false);
      return;
    }
    
    try {
      await adminAPI.updatePassword({
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
      
      showNotification(
        "success",
        "Mot de passe modifié !",
        "Votre mot de passe a été mis à jour avec succès"
      );
      
      setPasswordData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        showNotification(
          "error",
          "Erreur de validation",
          "Vérifiez votre mot de passe actuel"
        );
      } else {
        showNotification(
          "error",
          "Erreur",
          error.response?.data?.message || "Erreur lors du changement de mot de passe"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const NotificationToast = () => {
    if (!notification.show) return null;
    
    const bgColors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    };
    
    const icons = {
      success: <FaCheckCircle className="w-6 h-6" />,
      error: <FaExclamationCircle className="w-6 h-6" />,
      info: <FaInfoCircle className="w-6 h-6" />,
    };
    
    return (
      <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
        <div className={`${bgColors[notification.type]} text-white rounded-lg shadow-lg max-w-sm w-full`}>
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">
              {icons[notification.type]}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-4 flex-shrink-0 text-white hover:text-gray-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <span className="ml-4 text-gray-600">Chargement du profil...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <NotificationToast />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
                <p className="text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Mettez à jour vos informations de compte
                  </p>
                </div>
                
                <form onSubmit={updateProfile} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Changer le mot de passe
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Mettez à jour votre mot de passe pour plus de sécurité
                  </p>
                </div>
                
                <form onSubmit={updatePassword} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.current_password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Votre mot de passe actuel"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {errors.current_password && (
                      <p className="mt-1 text-sm text-red-600">{errors.current_password[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nouveau mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 8 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={passwordData.password_confirmation}
                        onChange={handlePasswordChange}
                        className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.password_confirmation ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Confirmez le nouveau mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                          Changement...
                        </>
                      ) : (
                        <>
                          <FaLock className="w-4 h-4 mr-2" />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Photo de profil
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Ajoutez ou modifiez votre photo de profil
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        <label className="p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                          <FaCamera className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                        
                        {currentAvatarPath && (
                          <button
                            type="button"
                            onClick={deleteAvatar}
                            disabled={deletingAvatar}
                            className="p-2 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Supprimer la photo"
                          >
                            {deletingAvatar ? (
                              <FaSpinner className="w-4 h-4 text-white animate-spin" />
                            ) : (
                              <FaTrash className="w-4 h-4 text-white" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 text-center">
                      Formats acceptés : JPG, PNG, GIF
                      <br />
                      Taille maximale : 5MB
                    </p>
                    
                    {currentAvatarPath && (
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        Cliquez sur la corbeille pour supprimer votre photo
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Informations sur le compte
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rôle :</span>
                    <span className="font-medium text-blue-700">Administrateur</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <span className="font-medium text-green-600">Actif</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <p className="text-gray-500 text-xs">
                      Dernière connexion : {new Date().toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;