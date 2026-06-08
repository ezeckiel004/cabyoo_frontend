import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaChartLine,
  FaUsers,
  FaCar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaTrophy,
  FaStar,
} from "react-icons/fa";

const Stats = () => {
  const [overview, setOverview] = useState(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Recharger les données quand la période change
  useEffect(() => {
    fetchOverview();
  }, [period]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ La route n'accepte pas de paramètre period pour l'instant
      // Mais nous pouvons filtrer côté frontend ou modifier l'API
      const response = await adminAPI.getOverviewStats();
      console.log("Stats data for period:", period, response.data);
      setOverview(response.data);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 €";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "0 €";
    return `${numAmount.toLocaleString("fr-FR")} €`;
  };

  const getPeriodLabel = () => {
    const labels = {
      today: "Aujourd'hui",
      week: "Cette semaine",
      month: "Ce mois",
      year: "Cette année"
    };
    return labels[period] || "Cette semaine";
  };

  // Filtrer les données selon la période (frontend)
  const filterDataByPeriod = (data) => {
    if (!data?.last_7_days) return data;
    
    const now = new Date();
    const filtered = { ...data };
    
    switch (period) {
      case 'today':
        filtered.last_7_days = data.last_7_days?.filter(day => 
          day.date === now.toISOString().split('T')[0]
        );
        break;
      case 'week':
        // Garder les 7 jours
        filtered.last_7_days = data.last_7_days;
        break;
      case 'month':
        // Garder les 30 jours (si disponibles)
        filtered.last_7_days = data.last_7_days;
        break;
      default:
        filtered.last_7_days = data.last_7_days;
    }
    
    return filtered;
  };

  const filteredOverview = filterDataByPeriod(overview);

  const statsCards = [
    {
      title: "Utilisateurs totaux",
      value: filteredOverview?.users?.total || 0,
      icon: FaUsers,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
      detail: `${filteredOverview?.users?.clients || 0} clients • ${filteredOverview?.users?.drivers || 0} chauffeurs`
    },
    {
      title: "Courses totales",
      value: filteredOverview?.rides?.total || 0,
      icon: FaCar,
      color: "bg-green-500",
      change: "+8%",
      trend: "up",
      detail: `${filteredOverview?.rides?.completed || 0} terminées • ${filteredOverview?.rides?.completion_rate || 0}% complétées`
    },
    {
      title: "Revenus totaux",
      value: formatCurrency(filteredOverview?.revenue?.completed_total || 0),
      icon: FaMoneyBillWave,
      color: "bg-purple-500",
      change: "+15%",
      trend: "up",
      detail: `Commission: ${formatCurrency(filteredOverview?.revenue?.platform || 0)}`
    },
    {
      title: "Taux d'achèvement",
      value: `${filteredOverview?.rides?.completion_rate || 0}%`,
      icon: FaChartLine,
      color: "bg-orange-500",
      change: "+2%",
      trend: "up",
      detail: `${filteredOverview?.rides?.cancelled || 0} annulations`
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Statistiques</h1>
              <p className="text-sm text-gray-500 mt-1">
                Vue d'ensemble de l'activité - {getPeriodLabel()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="today"> Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month"> Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              <button 
                onClick={fetchOverview}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Rafraîchir</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
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
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                        <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
                      </div>
                      {stat.change !== "+0%" && (
                        <div className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"} bg-gray-50 px-2 py-1 rounded-full`}>
                          {stat.trend === "up" ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
                          <span className="ml-1 text-xs font-medium">{stat.change}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-xs text-gray-400 border-t pt-2 mt-2">{stat.detail}</p>
                  </div>
                ))}
              </div>

              {/* Graphiques et données détaillées */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top chauffeurs */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaTrophy className="w-5 h-5 text-yellow-500" />
                      Top 5 Chauffeurs
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getPeriodLabel()}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {filteredOverview?.top_drivers?.slice(0, 5).map((driver, index) => (
                      <div
                        key={driver?.id || index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                              index === 1 ? 'bg-gray-100 text-gray-600' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'}
                          `}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {driver?.name || "Inconnu"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {driver?.car_model || driver?.driver_detail?.car_model || "Modèle non spécifié"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {formatCurrency(driver?.total_earnings || 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver?.completed_rides || 0} courses
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!filteredOverview?.top_drivers || filteredOverview.top_drivers.length === 0) && (
                      <div className="text-center text-gray-500 py-8">
                        <FaCar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        Aucun chauffeur trouvé pour cette période
                      </div>
                    )}
                  </div>
                </div>

                {/* Top clients */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaStar className="w-5 h-5 text-purple-500" />
                      Top 5 Clients
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getPeriodLabel()}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {filteredOverview?.top_clients?.slice(0, 5).map((client, index) => (
                      <div
                        key={client?.id || index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {client?.name || "Inconnu"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client?.email || "Email non disponible"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">
                            {formatCurrency(client?.total_spent || 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client?.total_rides || 0} courses
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!filteredOverview?.top_clients || filteredOverview.top_clients.length === 0) && (
                      <div className="text-center text-gray-500 py-8">
                        <FaUsers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        Aucun client trouvé pour cette période
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Activité quotidienne
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {getPeriodLabel()}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenus estimés
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenus réels
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOverview?.last_7_days?.map((day, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {day?.date || "Date inconnue"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-semibold text-blue-600">
                              {day?.rides || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-semibold text-gray-600">
                              {formatCurrency(day?.estimated_revenue || 0)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-semibold text-green-600">
                              {formatCurrency(day?.completed_revenue || 0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!filteredOverview?.last_7_days || filteredOverview.last_7_days.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center py-8 text-gray-500">
                            <FaCalendarAlt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            Aucune donnée disponible pour cette période
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