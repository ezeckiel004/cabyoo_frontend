import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FiLogOut, FiBell, FiUser } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <header className="bg-gradient-to-b from-[#150100] to-[#1a2f0a] border-b border-[#27a421]/20 sticky top-0 z-40">
      <div className="px-4 sm:px-6 mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo agrandi */}
          <div className={`flex items-center ${isMobile ? "ml-12" : ""}`}>
            <img
              src="/Cabyoo.jpeg"
              alt="CABYOO"
              className="h-10 sm:h-12 w-auto rounded-lg"
            />
          </div>

          {/* Actions et profil */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <button className="relative p-2 sm:p-2.5 text-gray-300 hover:text-[#27a421] transition-colors">
              <FiBell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Séparateur - caché sur mobile */}
            <div className="hidden sm:block w-px h-8 bg-[#27a421]/20"></div>

            {/* Profil utilisateur - version desktop */}
            {!isMobile && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.name || "Administrateur"}
                  </p>
                  <p className="text-xs text-green-300">
                    {user?.email || "admin@cabyoo.com"}
                  </p>
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-[#27a421] to-[#32bc2b] rounded-full flex items-center justify-center text-white font-semibold text-base shadow-lg">
                  {user?.name?.charAt(0) || "A"}
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
                  className="w-9 h-9 bg-gradient-to-br from-[#27a421] to-[#32bc2b] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                >
                  {user?.name?.charAt(0) || "A"}
                </button>

                {/* Menu déroulant mobile */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.name || "Administrateur"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "admin@cabyoo.com"}
                      </p>
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
