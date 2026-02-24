import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaArrowLeft,
  FaCar,
  FaMapMarkerAlt,
  FaUser,
  FaCalendar,
  FaMoneyBill,
  FaPhone,
  FaClock,
  FaEye,
  FaFileAlt,
} from "react-icons/fa";

const RideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRide();
  }, [id]);

  const fetchRide = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRide(id);
      setRide(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de la course:", error);
      alert("Erreur lors du chargement de la course");
    } finally {
      setLoading(false);
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
        className={`px-4 py-2 rounded-full text-sm font-medium ${badges[status] || "bg-gray-100 text-gray-800"}`}
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
        className={`px-3 py-1 rounded text-sm ${badges[method] || "bg-gray-100"}`}
      >
        {labels[method] || method}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 XAF";
    return `${parseFloat(amount).toLocaleString("fr-FR")} XAF`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("fr-FR") +
      " à " +
      date.toLocaleTimeString("fr-FR")
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="py-12 text-center">
              <FaCar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Course non trouvée
              </h3>
              <button
                onClick={() => navigate("/rides")}
                className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Retour à la liste des courses
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* En-tête avec bouton retour */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/rides")}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Retour à la liste des courses
            </button>

            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Course #{ride.ride_number || ride.id}
                </h1>
                <div className="flex items-center mt-2 space-x-4">
                  {getStatusBadge(ride.status)}
                  <span className="flex items-center text-sm text-gray-600">
                    <FaCalendar className="mr-1" />
                    {formatDate(ride.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded-md md:mt-0">
                <FaEye className="mr-2" />
                Mode visualisation
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Colonne 1: Informations principales */}
            <div className="space-y-6 lg:col-span-2">
              {/* Informations du trajet */}
              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Informations du trajet
                  </h2>
                  <div className="text-sm text-gray-500">
                    <FaFileAlt className="inline mr-1" />
                    Lecture seule
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-green-500" />
                    <div className="min-w-0">
                      <div className="mb-1 text-sm text-gray-500">Départ</div>
                      <div className="p-2 text-gray-800 rounded-md bg-gray-50">
                        {ride.pickup_address || "Non spécifié"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-red-500" />
                    <div className="min-w-0">
                      <div className="mb-1 text-sm text-gray-500">Arrivée</div>
                      <div className="p-2 text-gray-800 rounded-md bg-gray-50">
                        {ride.dropoff_address || "Non spécifié"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {ride.distance_km && (
                      <div className="p-3 rounded-md bg-gray-50">
                        <div className="text-sm text-gray-500">Distance</div>
                        <div className="font-medium">{ride.distance_km} km</div>
                      </div>
                    )}

                    {ride.duration_min && (
                      <div className="p-3 rounded-md bg-gray-50">
                        <div className="text-sm text-gray-500">
                          Durée estimée
                        </div>
                        <div className="font-medium">
                          {ride.duration_min} minutes
                        </div>
                      </div>
                    )}
                  </div>

                  {ride.notes && (
                    <div className="mt-4">
                      <div className="mb-2 text-sm text-gray-500">
                        Notes supplémentaires
                      </div>
                      <div className="p-4 text-gray-700 border border-gray-200 rounded-md bg-gray-50">
                        {ride.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations de paiement */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Informations de paiement
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-md bg-gray-50">
                    <div className="mb-1 text-sm text-gray-500">
                      Méthode de paiement
                    </div>
                    <div className="mt-1">
                      {getPaymentBadge(ride.payment_method)}
                    </div>
                  </div>

                  <div className="p-4 rounded-md bg-gray-50">
                    <div className="mb-1 text-sm text-gray-500">
                      Prix estimé
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {formatCurrency(ride.estimated_price)}
                    </div>
                  </div>

                  {ride.final_price && (
                    <div className="p-4 border border-green-100 rounded-md bg-green-50">
                      <div className="mb-1 text-sm text-gray-500">
                        Prix final
                      </div>
                      <div className="text-lg font-semibold text-green-700">
                        {formatCurrency(ride.final_price)}
                      </div>
                    </div>
                  )}

                  {ride.platform_commission && (
                    <div className="p-4 border border-blue-100 rounded-md bg-blue-50">
                      <div className="mb-1 text-sm text-gray-500">
                        Commission plateforme
                      </div>
                      <div className="text-lg font-semibold text-blue-700">
                        {formatCurrency(ride.platform_commission)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne 2: Informations des acteurs */}
            <div className="space-y-6">
              {/* Informations du client */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Informations du client
                </h2>
                {ride.client ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 mr-3 bg-blue-100 rounded-lg">
                        <FaUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ride.client.name}
                        </div>
                        <div className="text-sm text-gray-500">Client</div>
                      </div>
                    </div>

                    <div className="pl-2 space-y-2">
                      {ride.client.phone && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaPhone className="w-4 h-4 mr-2 text-gray-400" />
                          {ride.client.phone}
                        </div>
                      )}

                      {ride.client.email && (
                        <div className="text-sm text-gray-600 truncate">
                          {ride.client.email}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    <FaUser className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <div>Aucune information client disponible</div>
                  </div>
                )}
              </div>

              {/* Informations du chauffeur */}
              {ride.driver ? (
                <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Informations du chauffeur
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 mr-3 bg-purple-100 rounded-lg">
                        <FaCar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ride.driver.name}
                        </div>
                        <div className="text-sm text-gray-500">Chauffeur</div>
                      </div>
                    </div>

                    <div className="pl-2 space-y-2">
                      {ride.driver.phone && (
                        <div className="flex items-center text-sm text-gray-700">
                          <FaPhone className="w-4 h-4 mr-2 text-gray-400" />
                          {ride.driver.phone}
                        </div>
                      )}

                      {ride.driver.email && (
                        <div className="text-sm text-gray-600 truncate">
                          {ride.driver.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : ride.status === "pending" ? (
                <div className="p-6 border border-yellow-100 rounded-lg shadow bg-yellow-50">
                  <h2 className="mb-4 text-lg font-semibold text-yellow-800">
                    Chauffeur
                  </h2>
                  <div className="py-2 text-center">
                    <div className="font-medium text-yellow-700">
                      En attente d'un chauffeur
                    </div>
                    <div className="mt-1 text-sm text-yellow-600">
                      Aucun chauffeur n'a encore accepté cette course
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Horodatages */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Historique de la course
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <FaCalendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Créée</span>
                    </div>
                    <span className="font-medium">
                      {formatDate(ride.created_at)}
                    </span>
                  </div>

                  {ride.accepted_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-gray-600">Acceptée</span>
                      </div>
                      <span className="font-medium">
                        {formatDate(ride.accepted_at)}
                      </span>
                    </div>
                  )}

                  {ride.started_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2 text-green-400" />
                        <span className="text-gray-600">Démarrée</span>
                      </div>
                      <span className="font-medium">
                        {formatDate(ride.started_at)}
                      </span>
                    </div>
                  )}

                  {ride.completed_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-gray-600">Terminée</span>
                      </div>
                      <span className="font-medium">
                        {formatDate(ride.completed_at)}
                      </span>
                    </div>
                  )}

                  {ride.cancelled_at && (
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2 text-red-400" />
                        <span className="text-gray-600">Annulée</span>
                      </div>
                      <span className="font-medium">
                        {formatDate(ride.cancelled_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RideDetail;
