import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaChartLine,
  FaUsers,
  FaCar,
  FaMoneyBillWave,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const Stats = () => {
  const [overview, setOverview] = useState(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getOverviewStats();
      console.log("Stats data:", response.data); // Pour déboguer
      setOverview(response.data);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Utilisateurs totaux",
      value: overview?.users?.total || 0,
      icon: FaUsers,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Courses totales",
      value: overview?.rides?.total || 0,
      icon: FaCar,
      color: "bg-green-500",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Revenus totaux",
      value: `${(overview?.revenue?.total || 0).toLocaleString()} XAF`,
      icon: FaMoneyBillWave,
      color: "bg-purple-500",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Taux d'achèvement",
      value: `${overview?.rides?.completion_rate || 0}%`,
      icon: FaChartLine,
      color: "bg-orange-500",
      change: "+2%",
      trend: "up",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Statistiques</h1>
            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <FaCalendar className="w-4 h-4 mr-1" />
                Exporter
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Cartes de statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}
                      >
                        <stat.icon
                          className={`w-6 h-6 ${stat.color.replace(
                            "bg-",
                            "text-",
                          )}`}
                        />
                      </div>
                      <div
                        className={`flex items-center ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                        <span className="ml-1 text-sm font-medium">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                ))}
              </div>

              {/* Graphiques et données détaillées */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top chauffeurs */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Top 5 Chauffeurs
                  </h3>
                  <div className="space-y-4">
                    {overview?.top_drivers?.slice(0, 5).map((driver, index) => (
                      <div
                        key={driver?.id || index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {driver?.name || "Inconnu"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {driver?.driver_detail?.car_model ||
                                "Modèle non spécifié"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {(driver?.total_earnings || 0).toLocaleString()} XAF
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver?.completed_rides || 0} courses
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!overview?.top_drivers ||
                      overview.top_drivers.length === 0) && (
                      <div className="text-center text-gray-500 py-4">
                        Aucun chauffeur trouvé
                      </div>
                    )}
                  </div>
                </div>

                {/* Top clients */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Top 5 Clients
                  </h3>
                  <div className="space-y-4">
                    {overview?.top_clients?.slice(0, 5).map((client, index) => (
                      <div
                        key={client?.id || index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {client?.name || "Inconnu"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client?.email || "Email non disponible"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {(client?.total_spent || 0).toLocaleString()} XAF
                          </div>
                          <div className="text-sm text-gray-500">
                            {client?.total_rides || 0} courses
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!overview?.top_clients ||
                      overview.top_clients.length === 0) && (
                      <div className="text-center text-gray-500 py-4">
                        Aucun client trouvé
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activité des 7 derniers jours
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Courses
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Revenus
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                          Nouveaux utilisateurs
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {overview?.last_7_days?.map((day, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {day?.date || "Date inconnue"}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {day?.rides || 0}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            {(day?.revenue || 0).toLocaleString()} XAF
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {day?.new_users || 0}
                          </td>
                        </tr>
                      ))}
                      {(!overview?.last_7_days ||
                        overview.last_7_days.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            Aucune donnée disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Stats;
