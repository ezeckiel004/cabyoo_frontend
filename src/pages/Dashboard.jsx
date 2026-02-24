import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaUsers,
  FaCar,
  FaMoneyBillWave,
  FaUserCheck,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaCalendar,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserClock,
  FaEye,
  FaSync,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("today");
  const [recentActivities, setRecentActivities] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [rideTrends, setRideTrends] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [alerts, setAlerts] = useState({
    pendingDrivers: 0,
    cancelledRides: 0,
    pendingRides: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Récupérer les statistiques globales
      const overviewResponse = await adminAPI.getOverviewStats();
      console.log("Dashboard - Overview stats:", overviewResponse.data);
      console.log(
        "Dashboard - Revenue structure:",
        overviewResponse.data?.revenue,
      );
      setStats(overviewResponse.data);

      // 2. Récupérer les 5 dernières courses
      const ridesResponse = await adminAPI.getRides({
        limit: 5,
      });
      console.log("Dashboard - Recent rides response:", ridesResponse);

      let recentRides = [];
      if (ridesResponse.data) {
        if (ridesResponse.data.data) {
          recentRides = ridesResponse.data.data;
        } else if (Array.isArray(ridesResponse.data)) {
          recentRides = ridesResponse.data;
        }
      }
      console.log("Dashboard - Processed recent rides:", recentRides);
      setRecentActivities(recentRides);

      // 3. Récupérer les statistiques des courses pour les tendances
      if (overviewResponse.data?.last_7_days) {
        const trendData = overviewResponse.data.last_7_days.map((day) => ({
          date: new Date(day.date).toLocaleDateString("fr-FR", {
            weekday: "short",
          }),
          rides: day.rides || 0,
          estimated_revenue: day.estimated_revenue || 0,
          completed_revenue: day.completed_revenue || 0,
        }));
        console.log("Dashboard - Trend data:", trendData);
        setRideTrends(trendData);
      }

      // 4. Récupérer les données pour les alertes
      await fetchAlertsData(overviewResponse.data);

      // 5. Récupérer les top chauffeurs
      if (overviewResponse.data?.top_drivers) {
        console.log(
          "Dashboard - Top drivers:",
          overviewResponse.data.top_drivers,
        );
        setTopDrivers(overviewResponse.data.top_drivers);
      } else {
        try {
          const driversStatsResponse = await adminAPI.getDriversStats();
          console.log("Dashboard - Drivers stats:", driversStatsResponse.data);
          if (driversStatsResponse.data?.most_active_drivers) {
            setTopDrivers(driversStatsResponse.data.most_active_drivers);
          }
        } catch (error) {
          console.warn("Dashboard - Could not fetch drivers stats:", error);
          setTopDrivers([]);
        }
      }

      // 6. Récupérer les statistiques de revenus pour les méthodes de paiement
      try {
        const revenueStatsResponse = await adminAPI.getRevenueStats({
          period: "month",
        });
        console.log("Dashboard - Revenue stats:", revenueStatsResponse.data);
        if (revenueStatsResponse.data?.payment_methods) {
          setPaymentMethods(revenueStatsResponse.data.payment_methods);
        }
      } catch (error) {
        console.warn("Dashboard - Could not fetch revenue stats:", error);
      }
    } catch (error) {
      console.error("Dashboard - Erreur lors du chargement:", error);
      setRecentActivities([]);
      setTopDrivers([]);
      setRideTrends([]);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertsData = async (overviewData) => {
    try {
      const pendingDriversResponse = await adminAPI.getPendingDrivers();
      console.log(
        "Dashboard - Pending drivers response:",
        pendingDriversResponse,
      );

      let pendingDriversCount = 0;
      if (pendingDriversResponse.data) {
        if (pendingDriversResponse.data.data) {
          pendingDriversCount = pendingDriversResponse.data.data.length;
        } else if (pendingDriversResponse.data.total_pending !== undefined) {
          pendingDriversCount = pendingDriversResponse.data.total_pending;
        } else if (Array.isArray(pendingDriversResponse.data)) {
          pendingDriversCount = pendingDriversResponse.data.length;
        }
      }

      let cancelledRidesCount = 0;
      let pendingRidesCount = 0;

      if (overviewData) {
        cancelledRidesCount = overviewData.rides?.today_cancelled || 0;
        pendingRidesCount = overviewData.rides?.pending || 0;
      }

      setAlerts({
        pendingDrivers: pendingDriversCount,
        cancelledRides: cancelledRidesCount,
        pendingRides: pendingRidesCount,
      });
    } catch (error) {
      console.error(
        "Dashboard - Erreur lors du chargement des alertes:",
        error,
      );
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      assigned: "bg-blue-100 text-blue-800 border border-blue-200",
      ongoing: "bg-purple-100 text-purple-800 border border-purple-200",
      started: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      completed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };

    const labels = {
      pending: "En attente",
      assigned: "Assignée",
      ongoing: "En cours",
      started: "Commençée",
      completed: "Terminée",
      cancelled: "Annulée",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || "bg-gray-100 text-gray-800"}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentBadge = (method) => {
    const badges = {
      cash: "bg-gray-100 text-gray-800 border border-gray-200",
      mobile_money: "bg-green-100 text-green-800 border border-green-200",
      card: "bg-blue-100 text-blue-800 border border-blue-200",
    };

    const labels = {
      cash: "Espèces",
      mobile_money: "Mobile Money",
      card: "Carte",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs ${badges[method] || "bg-gray-100"}`}
      >
        {labels[method] || method}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 XAF";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "0 XAF";
    return `${numAmount.toLocaleString("fr-FR")} XAF`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch (e) {
      return "Date invalide";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Heure invalide";
    }
  };

  const handleViewRide = (rideId) => {
    window.location.href = `/rides/${rideId}`;
  };

  const safeSlice = (array, start, end) => {
    if (!Array.isArray(array)) return [];
    return array.slice(start, end);
  };

  const formatDriverName = (driver) => {
    if (typeof driver === "string") return driver;
    if (driver.name) return driver.name;
    if (driver.first_name && driver.last_name)
      return `${driver.first_name} ${driver.last_name}`;
    if (driver.first_name) return driver.first_name;
    return "Chauffeur inconnu";
  };

  const formatDriverEarnings = (driver) => {
    if (typeof driver === "string") return 0;
    return driver.total_earnings || driver.earnings || 0;
  };

  const formatDriverRides = (driver) => {
    if (typeof driver === "string") return 0;
    return driver.completed_rides || 0;
  };

  const getStatCards = () => {
    if (!stats) return [];

    let estimatedRevenue = 0;
    let completedRevenue = 0;
    let platformRevenue = 0;
    let todayEstimatedRevenue = 0;
    let todayCompletedRevenue = 0;

    if (stats.revenue) {
      estimatedRevenue =
        stats.revenue.estimated_total || stats.revenue.estimated || 0;
      completedRevenue =
        stats.revenue.completed_total || stats.revenue.completed || 0;
      platformRevenue = stats.revenue.platform || 0;
      todayEstimatedRevenue = stats.revenue.today_estimated || 0;
      todayCompletedRevenue = stats.revenue.today_completed || 0;
    }

    return [
      {
        title: "Utilisateurs totaux",
        value: stats.users?.total || 0,
        icon: FaUsers,
        color: "bg-blue-500",
        change: "+0%",
        trend: "up",
        description: "Clients et chauffeurs",
        detail: `${stats.users?.clients || 0} clients, ${stats.users?.drivers || 0} chauffeurs`,
      },
      {
        title: "Courses aujourd'hui",
        value: stats.rides?.today || 0,
        icon: FaCar,
        color: "bg-green-500",
        change: "+0%",
        trend: "up",
        description: "Toutes les courses",
        detail: `${stats.rides?.today_completed || 0} terminées, ${stats.rides?.today_cancelled || 0} annulées`,
      },
      {
        title: "Revenus estimés",
        value: formatCurrency(estimatedRevenue),
        icon: FaMoneyBillWave,
        color: "bg-purple-500",
        change: "+0%",
        trend: estimatedRevenue > 0 ? "up" : "down",
        description: "Chiffre d'affaires estimé",
        detail: `Aujourd'hui: ${formatCurrency(todayEstimatedRevenue)}`,
      },
      {
        title: "Revenus réalisés",
        value: formatCurrency(completedRevenue),
        icon: FaMoneyBillWave,
        color: "bg-indigo-500",
        change: "+0%",
        trend: completedRevenue > 0 ? "up" : "down",
        description: "Chiffre d'affaires réalisé",
        detail: `Commission: ${formatCurrency(platformRevenue)}`,
      },
    ];
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getPaymentData = () => {
    if (paymentMethods.length > 0) {
      return paymentMethods.map((method) => ({
        name: method.name,
        value: method.value || method.count || 0,
      }));
    }

    return [
      { name: "Espèces", value: 65 },
      { name: "Mobile Money", value: 30 },
      { name: "Carte", value: 5 },
    ];
  };

  const statCards = getStatCards();
  const paymentData = getPaymentData();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Tableau de bord
              </h1>
              <p className="mt-1 text-gray-600">
                Aperçu global de l'activité SIMCAR - Mode visualisation
              </p>
            </div>

            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <div className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md">
                <FaCalendar className="mr-2 text-gray-400" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              <button
                onClick={fetchDashboardData}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaSync className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <span className="ml-4 text-gray-600">
                Chargement du tableau de bord...
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-lg shadow transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}
                      >
                        <stat.icon
                          className={`w-7 h-7 ${stat.color.replace("bg-", "text-")}`}
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
                    <h3 className="mb-1 text-2xl font-bold text-gray-800">
                      {stat.value}
                    </h3>
                    <p className="mb-1 text-base font-medium text-gray-700">
                      {stat.title}
                    </p>
                    <p className="mb-2 text-sm text-gray-500">
                      {stat.description}
                    </p>
                    <p className="text-xs text-gray-400">{stat.detail}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <FaChartLine className="w-5 h-5 mr-2 text-blue-600" />
                    Évolution des courses (7 derniers jours)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rideTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "rides")
                              return [`${value}`, "Nombre de courses"];
                            if (name === "estimated_revenue")
                              return [
                                `${formatCurrency(value)}`,
                                "Revenus estimés",
                              ];
                            if (name === "completed_revenue")
                              return [
                                `${formatCurrency(value)}`,
                                "Revenus réalisés",
                              ];
                            return [value, name];
                          }}
                          labelFormatter={(label) => `Jour: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rides"
                          name="Nombre de courses"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="estimated_revenue"
                          name="Revenus estimés"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="completed_revenue"
                          name="Revenus réalisés"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                    <FaMoneyBillWave className="w-5 h-5 mr-2 text-green-600" />
                    Répartition des paiements
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => {
                            const total = paymentData.reduce(
                              (sum, item) => sum + item.value,
                              0,
                            );
                            const percentage =
                              total > 0
                                ? ((value / total) * 100).toFixed(1)
                                : 0;
                            return [
                              `${formatCurrency(value)} (${percentage}%)`,
                              props.payload.name,
                            ];
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800">
                      <FaClock className="w-5 h-5 mr-2 text-blue-600" />
                      Activité récente
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Course
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Trajet
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {safeSlice(recentActivities, 0, 5).map((ride) => (
                          <tr key={ride.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {ride.ride_number || `#${ride.id}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTime(ride.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs space-y-1">
                                <div className="flex items-center text-xs text-gray-600">
                                  <FaMapMarkerAlt className="flex-shrink-0 w-3 h-3 mr-1 text-green-500" />
                                  <span className="truncate">
                                    {ride.pickup_address || "Départ"}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <FaMapMarkerAlt className="flex-shrink-0 w-3 h-3 mr-1 text-red-500" />
                                  <span className="truncate">
                                    {ride.dropoff_address || "Arrivée"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {ride.status && getStatusBadge(ride.status)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <button
                                onClick={() => handleViewRide(ride.id)}
                                className="flex items-center px-3 py-1.5 text-sm text-blue-600 transition duration-150 ease-in-out bg-blue-50 rounded-md hover:text-blue-900 hover:bg-blue-100"
                              >
                                <FaEye className="mr-2" />
                                Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {recentActivities.length === 0 && (
                    <div className="py-8 text-center">
                      <FaClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">Aucune activité récente</p>
                    </div>
                  )}
                  {recentActivities.length > 0 && (
                    <div className="px-6 py-3 text-right border-t border-gray-200 bg-gray-50">
                      <a
                        href="/rides"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Voir toutes les courses →
                      </a>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800">
                      <FaUserCheck className="w-5 h-5 mr-2 text-green-600" />
                      Top chauffeurs
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {safeSlice(topDrivers, 0, 5).map((driver, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`flex items-center justify-center w-8 h-8 mr-3 font-bold rounded-full ${
                                index === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : index === 1
                                    ? "bg-gray-100 text-gray-800"
                                    : index === 2
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {formatDriverName(driver)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {driver.email ||
                                  driver.phone ||
                                  "Contact non disponible"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {formatCurrency(formatDriverEarnings(driver))}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDriverRides(driver)} courses
                            </div>
                          </div>
                        </div>
                        {driver.car_model && (
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <FaCar className="w-3 h-3 mr-1" />
                            <span className="mr-3">
                              {driver.car_model || "Modèle inconnu"}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                              {driver.car_plate || "Sans plaque"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {topDrivers.length === 0 && (
                    <div className="py-8 text-center">
                      <FaUserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">
                        Aucun chauffeur pour le moment
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <FaExclamationTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Alertes et notifications
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div
                    className={`border-l-4 border-yellow-500 ${
                      alerts.pendingDrivers > 0 ? "bg-yellow-50" : "bg-gray-50"
                    } p-4 rounded-r transition-colors hover:bg-yellow-100`}
                  >
                    <div className="flex items-center">
                      <FaUserClock className="w-5 h-5 mr-3 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Chauffeurs en attente
                        </h4>
                        <p className="text-sm text-yellow-700">
                          {alerts.pendingDrivers} inscription
                          {alerts.pendingDrivers !== 1 ? "s" : ""} à valider
                        </p>
                      </div>
                    </div>
                    {alerts.pendingDrivers > 0 && (
                      <div className="mt-3">
                        <a
                          href="/pending-drivers"
                          className="inline-flex items-center text-sm text-yellow-700 hover:text-yellow-900"
                        >
                          Gérer les inscriptions <FaEye className="ml-2" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div
                    className={`border-l-4 border-red-500 ${
                      alerts.cancelledRides > 0 ? "bg-red-50" : "bg-gray-50"
                    } p-4 rounded-r transition-colors hover:bg-red-100`}
                  >
                    <div className="flex items-center">
                      <FaTimesCircle className="w-5 h-5 mr-3 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-800">
                          Courses annulées
                        </h4>
                        <p className="text-sm text-red-700">
                          {alerts.cancelledRides} annulation
                          {alerts.cancelledRides !== 1 ? "s" : ""} aujourd'hui
                        </p>
                      </div>
                    </div>
                    {alerts.cancelledRides > 0 && (
                      <div className="mt-3">
                        <a
                          href="/rides?status=cancelled"
                          className="inline-flex items-center text-sm text-red-700 hover:text-red-900"
                        >
                          Voir les annulations <FaEye className="ml-2" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div
                    className={`border-l-4 border-blue-500 ${
                      alerts.pendingRides > 0 ? "bg-blue-50" : "bg-gray-50"
                    } p-4 rounded-r transition-colors hover:bg-blue-100`}
                  >
                    <div className="flex items-center">
                      <FaClock className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-blue-800">
                          Courses en attente
                        </h4>
                        <p className="text-sm text-blue-700">
                          {alerts.pendingRides} course
                          {alerts.pendingRides !== 1 ? "s" : ""} disponibles
                        </p>
                      </div>
                    </div>
                    {alerts.pendingRides > 0 && (
                      <div className="mt-3">
                        <a
                          href="/rides?status=pending"
                          className="inline-flex items-center text-sm text-blue-700 hover:text-blue-900"
                        >
                          Voir les courses <FaEye className="ml-2" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Note:</span> Ce tableau de
                      bord est en mode visualisation. Vous pouvez surveiller
                      l'activité mais les actions sont limitées.
                    </p>
                  </div>

                  {alerts.pendingDrivers > 0 && (
                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Action disponible:</span>{" "}
                        Vous pouvez valider les chauffeurs en attente dans la
                        section "Chauffeurs en attente".
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
