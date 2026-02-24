import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaChartBar,
  FaCog,
  FaUserClock,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Définition des éléments de navigation
  const navItems = [
    { to: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { to: "/users", icon: FaUsers, label: "Utilisateurs" },
    {
      to: "/pending-drivers",
      icon: FaUserClock,
      label: "Chauffeurs en attente",
      badge: 3,
    },
    { to: "/rides", icon: FaCar, label: "Courses" },
    { to: "/stats", icon: FaChartBar, label: "Statistiques" },
    { to: "/settings", icon: FaCog, label: "Paramètres" },
  ];

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Bouton menu mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gradient-to-b from-[#150100] to-[#1a2f0a] text-white p-3 rounded-lg shadow-lg"
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Overlay pour mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed left-0 top-0 z-50 transition-transform duration-300 ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "relative"
        } ${
          isCollapsed && !isMobile ? "w-20" : "w-64"
        } bg-gradient-to-b from-[#150100] to-[#1a2f0a] min-h-screen shadow-2xl transition-all duration-300 ease-in-out`}
      >
        {/* Bouton de collapse (caché sur mobile) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 z-10"
          >
            {isCollapsed ? (
              <FaChevronRight className="w-3 h-3 text-[#27a421]" />
            ) : (
              <FaChevronLeft className="w-3 h-3 text-[#27a421]" />
            )}
          </button>
        )}

        {/* Bouton fermer sur mobile */}
        {isMobile && isMobileOpen && (
          <button
            onClick={closeMobileSidebar}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <span className="text-2xl">&times;</span>
          </button>
        )}

        {/* Espace vide en haut */}
        <div className={`${isCollapsed && !isMobile ? "py-6" : "py-8"}`}></div>

        {/* Navigation */}
        <nav className="mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `relative flex items-center ${
                  isCollapsed && !isMobile ? "justify-center px-2" : "px-6"
                } py-3 mx-2 my-1 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#27a421] to-[#32bc2b] text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icône */}
                  <item.icon
                    className={`${
                      isCollapsed && !isMobile ? "w-6 h-6" : "w-5 h-5 mr-3"
                    } transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />

                  {/* Label (caché si réduit sur desktop) */}
                  {(!isCollapsed || isMobile) && (
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                  )}

                  {/* Badge pour les notifications */}
                  {(!isCollapsed || isMobile) && item.badge && (
                    <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip pour la version réduite sur desktop */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!isMobile && (
          <>
            {!isCollapsed ? (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="px-4 py-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-green-300 mb-1">Version</p>
                  <p className="text-sm font-medium text-white">2.0.0</p>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-green-300">v2</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer mobile simplifié */}
        {isMobile && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="px-4 py-2 bg-white/5 rounded-lg text-center">
              <p className="text-xs text-green-300">Version 2.0.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
