import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fonction pour obtenir l'URL complète de l'avatar
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    if (avatarPath.startsWith("/storage")) {
      return `${API_BASE_URL}${avatarPath}`;
    }
    if (avatarPath.startsWith("storage")) {
      return `${API_BASE_URL}/${avatarPath}`;
    }
    return `${API_BASE_URL}/storage/${avatarPath}`;
  };

  // Mettre à jour l'URL de l'avatar quand l'utilisateur change
  useEffect(() => {
    if (user?.avatar || user?.profile_picture) {
      const avatar = user?.avatar || user?.profile_picture;
      setAvatarUrl(getAvatarUrl(avatar));
      setImageError(false); // Réinitialiser l'erreur quand une nouvelle photo est chargée
    } else {
      setAvatarUrl(null);
      setImageError(false);
    }
  }, [user]);

  // Gérer l'erreur de chargement de l'image
  const handleImageError = () => {
    setImageError(true);
    setAvatarUrl(null);
  };

  // Récupérer les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user?.name) return "A";
    return user.name.charAt(0).toUpperCase();
  };

  // Récupérer le nom complet
  const getFullName = () => {
    return user?.name || "Administrateur";
  };

  // Récupérer l'email
  const getUserEmail = () => {
    return user?.email || "admin@cabyoo.com";
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#150100] to-[#1a2f0a] border-b border-[#27a421]/20 sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className={`flex items-center ${isMobile ? "ml-12" : ""}`}>
            <img
              src="/Cabyoo.jpeg"
              alt="CABYOO"
              className="h-10 sm:h-12 w-auto rounded-lg"
            />
          </div>

          {/* Actions et profil */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Profil utilisateur - version desktop */}
            {!isMobile && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {getFullName()}
                  </p>
                  <p className="text-xs text-green-300">
                    {getUserEmail()}
                  </p>
                </div>

                {/* Avatar avec photo ou placeholder */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#27a421] to-[#32bc2b] flex items-center justify-center text-white font-semibold text-base shadow-lg">
                  {avatarUrl && !imageError ? (
                    <img
                      src={avatarUrl}
                      alt={getFullName()}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>

                {/* Déconnexion */}
                <button
                  onClick={logout}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Déconnexion"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Profil utilisateur - version mobile */}
            {isMobile && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#27a421] to-[#32bc2b] flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                >
                  {avatarUrl && !imageError ? (
                    <img
                      src={avatarUrl}
                      alt={getFullName()}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </button>

                {/* Menu déroulant mobile */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {avatarUrl && !imageError ? (
                          <img
                            src={avatarUrl}
                            alt={getFullName()}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <FiUser className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {getFullName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getUserEmail()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;