import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaCar,
  FaMapMarkerAlt,
  FaUser,
  FaCalendar,
  FaMoneyBill,
  FaExchangeAlt,
  FaEye,
  FaFilter,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Rides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_rides: 0,
    completed_rides: 0,
    estimated_revenue: 0,
    completed_revenue: 0,
    platform_revenue: 0,
    average_estimated_value: 0,
    average_completed_value: 0,
    cancellation_rate: 0,
    pending_rides: 0,
    cancelled_rides: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // Changé de "today" à "all"

  // États pour la pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    fetchRides();
    fetchStats();
  }, [statusFilter, dateFilter, pagination.current_page]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (dateFilter === "today") {
        params.date = new Date().toISOString().split("T")[0];
      } else if (dateFilter === "week") {
        // Calculer la date de début de la semaine
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Dimanche
        params.date = startOfWeek.toISOString().split("T")[0];
      } else if (dateFilter === "month") {
        // Premier jour du mois
        const today = new Date();
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        );
        params.date = firstDayOfMonth.toISOString().split("T")[0];
      } else if (dateFilter === "year") {
        // Premier jour de l'année
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        params.date = firstDayOfYear.toISOString().split("T")[0];
      }
      // Si dateFilter === "all", on ne met pas de paramètre date

      console.log("Fetching rides with params:", params);

      const response = await adminAPI.getRides(params);

      console.log("API Response:", response);
      console.log("Full pagination data:", response.data);

      let ridesData = [];

      // Laravel pagination returns data in response.data.data
      if (response.data && response.data.data) {
        ridesData = response.data.data;

        // Update pagination info
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 20,
          total: response.data.total || 0,
          from: response.data.from || 0,
          to: response.data.to || 0,
        });

        console.log("Using paginated data structure");
        console.log("Total rides in database:", response.data.total);
        console.log("Current page:", response.data.current_page);
        console.log("Last page:", response.data.last_page);
      } else if (Array.isArray(response.data)) {
        ridesData = response.data;
        console.log("Using direct array structure");
      } else if (response.data) {
        ridesData = response.data;
        console.log("Using raw response data");
      }

      console.log("Processed rides data:", ridesData);
      console.log("Number of rides on this page:", ridesData.length);

      if (ridesData.length > 0) {
        console.log("Sample ride:", ridesData[0]);
      }

      setRides(ridesData);
    } catch (error) {
      console.error("Erreur lors du chargement des courses:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(`Erreur lors du chargement des courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = {};

      if (dateFilter === "today") params.period = "today";
      else if (dateFilter === "week") params.period = "week";
      else if (dateFilter === "month") params.period = "month";
      else if (dateFilter === "year") params.period = "year";
      else params.period = "all"; // Changé de "today" à "all"

      const response = await adminAPI.getRidesDashboardStats(params);
      console.log("Stats response:", response.data);

      const statsData = response.data;
      setStats({
        total_rides: statsData.total_rides || 0,
        completed_rides: statsData.completed_rides || 0,
        estimated_revenue: statsData.estimated_revenue || 0,
        completed_revenue: statsData.completed_revenue || 0,
        platform_revenue: statsData.platform_revenue || 0,
        average_estimated_value: statsData.average_estimated_value || 0,
        average_completed_value: statsData.average_completed_value || 0,
        cancellation_rate: statsData.cancellation_rate || 0,
        cancelled_rides: statsData.cancelled_rides || 0,
        pending_rides: statsData.pending_rides || 0,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const refreshData = () => {
    // Reset to first page when refreshing
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchRides();
    fetchStats();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination((prev) => ({ ...prev, current_page: page }));
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

  const handleViewRide = (rideId) => {
    navigate(`/rides/${rideId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  // Fonction pour générer les boutons de pagination
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(
      1,
      pagination.current_page - Math.floor(maxVisibleButtons / 2),
    );
    let endPage = Math.min(
      pagination.last_page,
      startPage + maxVisibleButtons - 1,
    );

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Bouton précédent
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.current_page - 1)}
        disabled={pagination.current_page === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>,
    );

    // Première page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-4 py-2 text-sm text-gray-500">
            ...
          </span>,
        );
      }
    }

    // Pages centrales
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium border ${
            pagination.current_page === i
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>,
      );
    }

    // Dernière page
    if (endPage < pagination.last_page) {
      if (endPage < pagination.last_page - 1) {
        buttons.push(
          <span key="dots2" className="px-4 py-2 text-sm text-gray-500">
            ...
          </span>,
        );
      }
      buttons.push(
        <button
          key={pagination.last_page}
          onClick={() => handlePageChange(pagination.last_page)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          {pagination.last_page}
        </button>,
      );
    }

    // Bouton suivant
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.current_page + 1)}
        disabled={pagination.current_page === pagination.last_page}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>,
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-x-auto">
          <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestion des courses
              </h1>
              <p className="mt-1 text-gray-600">
                Visualisation des courses - Lecture seule
              </p>
            </div>
            <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:mt-0">
              <div className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md">
                <FaFilter className="mr-2 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
              <div className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md">
                <FaFilter className="mr-2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="assigned">Assignée</option>
                  <option value="started">Commençée</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <FaSync className="mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-blue-100 rounded-lg">
                  <FaCar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses totales</p>
                  <p className="text-2xl font-bold">{stats.total_rides}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {pagination.total} dans la base de données
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-green-100 rounded-lg">
                  <FaMoneyBill className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenus estimés</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats.estimated_revenue)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Moyenne: {formatCurrency(stats.average_estimated_value)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-purple-100 rounded-lg">
                  <FaMoneyBill className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenus réalisés</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats.completed_revenue)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Commission: {formatCurrency(stats.platform_revenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-yellow-100 rounded-lg">
                  <FaExchangeAlt className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux d'annulation</p>
                  <p className="text-2xl font-bold">
                    {stats.cancellation_rate}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {stats.cancelled_rides} annulées / {stats.total_rides} total
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="flex flex-col items-start justify-between px-6 py-4 border-b border-gray-200 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Liste des courses
                </h2>
                <p className="text-sm text-gray-600">
                  {rides.length > 0 ? (
                    <>
                      Affichage {pagination.from} à {pagination.to} sur{" "}
                      {pagination.total} course
                      {pagination.total !== 1 ? "s" : ""}
                    </>
                  ) : (
                    "Aucune course"
                  )}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-500 md:mt-0">
                Filtres:{" "}
                {statusFilter === "all" ? "Tous statuts" : statusFilter} |{" "}
                {dateFilter === "all" ? "Toutes dates" : dateFilter}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <span className="ml-4 text-gray-600">
                  Chargement des courses...
                </span>
              </div>
            ) : rides.length === 0 ? (
              <div className="py-12 text-center">
                <FaCar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Aucune course trouvée
                </h3>
                <p className="mb-4 text-gray-500">
                  Aucune course ne correspond aux filtres sélectionnés
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setDateFilter("all");
                    setPagination((prev) => ({ ...prev, current_page: 1 }));
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Informations
                        </th>
                        <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:table-cell">
                          Client & Chauffeur
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Trajet
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Montant
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
                      {rides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {ride.ride_number || `#${ride.id}`}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FaCalendar className="w-3 h-3 mr-1" />
                              {formatDate(ride.created_at)}
                            </div>
                          </td>

                          <td className="hidden px-6 py-4 lg:table-cell">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FaUser className="w-3 h-3 mr-2 text-gray-400" />
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Client
                                  </div>
                                  <div className="text-sm font-medium truncate max-w-[150px]">
                                    {ride.client?.name || "Non spécifié"}
                                  </div>
                                </div>
                              </div>
                              {ride.driver && (
                                <div className="flex items-center">
                                  <FaCar className="w-3 h-3 mr-2 text-gray-400" />
                                  <div>
                                    <div className="text-xs text-gray-500">
                                      Chauffeur
                                    </div>
                                    <div className="text-sm font-medium truncate max-w-[150px]">
                                      {ride.driver?.name || "Non spécifié"}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <FaMapMarkerAlt className="flex-shrink-0 w-3 h-3 mt-1 mr-2 text-green-500" />
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500">
                                    Départ
                                  </div>
                                  <div className="max-w-xs text-sm truncate">
                                    {ride.pickup_address || "Non spécifié"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FaMapMarkerAlt className="flex-shrink-0 w-3 h-3 mt-1 mr-2 text-red-500" />
                                <div className="min-w-0">
                                  <div className="text-xs text-gray-500">
                                    Arrivée
                                  </div>
                                  <div className="max-w-xs text-sm truncate">
                                    {ride.dropoff_address || "Non spécifié"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {ride.final_price
                                ? formatCurrency(ride.final_price)
                                : formatCurrency(ride.estimated_price)}
                            </div>
                            <div className="mt-1">
                              {ride.payment_method &&
                                getPaymentBadge(ride.payment_method)}
                            </div>
                            {ride.platform_commission && (
                              <div className="mt-1 text-xs text-gray-500">
                                Commission:{" "}
                                {formatCurrency(ride.platform_commission)}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {ride.status && getStatusBadge(ride.status)}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <button
                              onClick={() => handleViewRide(ride.id)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md flex items-center text-sm transition duration-150 ease-in-out"
                            >
                              <FaEye className="mr-2" />
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex flex-col items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 md:flex-row">
                    <div className="mb-2 text-sm text-gray-500 md:mb-0">
                      Affichage de {pagination.from} à {pagination.to} sur{" "}
                      {pagination.total} course
                      {pagination.total !== 1 ? "s" : ""}
                    </div>
                    <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                      <div className="text-sm text-gray-700">
                        Page {pagination.current_page} sur{" "}
                        {pagination.last_page}
                      </div>
                      <nav className="flex">{renderPaginationButtons()}</nav>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Rides;
