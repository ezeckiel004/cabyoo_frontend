import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../api/admin";
import {
  FaSave,
  FaEuroSign,
  FaCog,
  FaBell,
  FaCreditCard,
  FaSpinner,
} from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("tarifs");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tarifs
  const [tarifs, setTarifs] = useState({
    price_per_km: 2.50,
    min_price: 8,
    night_surcharge_percent: 20,
    airport_surcharge: 5,
    long_distance_threshold_km: 20,
    long_distance_surcharge_percent: 10,
    platform_commission_percent: 20,
  });

  // Paramètres généraux
  const [general, setGeneral] = useState({
    company_name: "SIMCAR VTC",
    company_email: "contact@simcar.com",
    company_phone: "+33 6 XX XX XX XX",
    company_address: "Paris, France",
  });

  // Paiements
  const [payments, setPayments] = useState({
    cash_enabled: true,
    mobile_money_enabled: true,
    card_enabled: false,
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    send_email_notifications: true,
    send_sms_notifications: false,
    send_push_notifications: true,
  });

  // Charger les paramètres au montage
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadingData(true);
      const response = await adminAPI.getSettings();
      
      if (response.data) {
        // Charger les tarifs
        if (response.data.tarifs) {
          setTarifs(prev => ({
            ...prev,
            price_per_km: parseFloat(response.data.tarifs.price_per_km?.value || prev.price_per_km),
            min_price: parseFloat(response.data.tarifs.min_price?.value || prev.min_price),
            night_surcharge_percent: parseFloat(response.data.tarifs.night_surcharge_percent?.value || prev.night_surcharge_percent),
            airport_surcharge: parseFloat(response.data.tarifs.airport_surcharge?.value || prev.airport_surcharge),
            long_distance_threshold_km: parseFloat(response.data.tarifs.long_distance_threshold_km?.value || prev.long_distance_threshold_km),
            long_distance_surcharge_percent: parseFloat(response.data.tarifs.long_distance_surcharge_percent?.value || prev.long_distance_surcharge_percent),
            platform_commission_percent: parseFloat(response.data.tarifs.platform_commission_percent?.value || prev.platform_commission_percent),
          }));
        }

        // Charger les paramètres généraux
        if (response.data.general) {
          setGeneral(prev => ({
            ...prev,
            company_name: response.data.general.company_name?.value || prev.company_name,
            company_email: response.data.general.company_email?.value || prev.company_email,
            company_phone: response.data.general.company_phone?.value || prev.company_phone,
            company_address: response.data.general.company_address?.value || prev.company_address,
          }));
        }

        // Charger les paramètres de paiement
        if (response.data.payments) {
          setPayments(prev => ({
            ...prev,
            cash_enabled: response.data.payments.cash_enabled?.value === true || response.data.payments.cash_enabled?.value === "1" || response.data.payments.cash_enabled?.value === 1 || prev.cash_enabled,
            mobile_money_enabled: response.data.payments.mobile_money_enabled?.value === true || response.data.payments.mobile_money_enabled?.value === "1" || response.data.payments.mobile_money_enabled?.value === 1 || prev.mobile_money_enabled,
            card_enabled: response.data.payments.card_enabled?.value === true || response.data.payments.card_enabled?.value === "1" || response.data.payments.card_enabled?.value === 1 || prev.card_enabled,
          }));
        }

        // Charger les paramètres de notifications
        if (response.data.notifications) {
          setNotifications(prev => ({
            ...prev,
            send_email_notifications: response.data.notifications.send_email_notifications?.value === true || response.data.notifications.send_email_notifications?.value === "1" || response.data.notifications.send_email_notifications?.value === 1 || prev.send_email_notifications,
            send_sms_notifications: response.data.notifications.send_sms_notifications?.value === true || response.data.notifications.send_sms_notifications?.value === "1" || response.data.notifications.send_sms_notifications?.value === 1 || prev.send_sms_notifications,
            send_push_notifications: response.data.notifications.send_push_notifications?.value === true || response.data.notifications.send_push_notifications?.value === "1" || response.data.notifications.send_push_notifications?.value === 1 || prev.send_push_notifications,
          }));
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      showMessage("error", "Impossible de charger les paramètres");
    } finally {
      setLoadingData(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleTarifChange = (e) => {
    const { name, value } = e.target;
    setTarifs((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneral((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, checked } = e.target;
    setPayments((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const saveTarifs = async () => {
    try {
      setLoading(true);
      await adminAPI.updateTarifs(tarifs);
      showMessage("success", "Tarifs mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      showMessage("error", "Erreur lors de la mise à jour des tarifs");
    } finally {
      setLoading(false);
    }
  };

  const saveGeneral = async () => {
    try {
      setLoading(true);
      await adminAPI.updateGeneralSettings(general);
      showMessage("success", "Paramètres généraux mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      showMessage("error", "Erreur lors de la mise à jour des paramètres généraux");
    } finally {
      setLoading(false);
    }
  };

  const savePayments = async () => {
    try {
      setLoading(true);
      await adminAPI.updatePaymentsSettings(payments);
      showMessage("success", "Paramètres de paiement mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      showMessage("error", "Erreur lors de la mise à jour des paramètres de paiement");
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setLoading(true);
      await adminAPI.updateNotificationsSettings(notifications);
      showMessage("success", "Paramètres de notifications mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      showMessage("error", "Erreur lors de la mise à jour des paramètres de notifications");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "tarifs", label: "Tarifs", icon: FaEuroSign, save: saveTarifs },
    { id: "general", label: "Général", icon: FaCog, save: saveGeneral },
    { id: "payments", label: "Paiements", icon: FaCreditCard, save: savePayments },
    // { id: "notifications", label: "Notifications", icon: FaBell, save: saveNotifications },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  if (loadingData) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <FaSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des paramètres...</p>
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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
              <p className="mt-1 text-gray-600">
                Gérez la configuration de l'application
              </p>
            </div>
            {currentTab && (
              <button
                onClick={currentTab.save}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaSave className="w-4 h-4 mr-2" />
                )}
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            )}
          </div>

          {/* Message de notification */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-red-100 text-red-800 border border-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 md:gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des tabs */}
          <div className="max-w-4xl">
            {activeTab === "tarifs" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Configuration des tarifs
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Modifiez les tarifs appliqués aux courses
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix au kilomètre (€)
                    </label>
                    <input
                      type="number"
                      name="price_per_km"
                      value={tarifs.price_per_km}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (€)
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      value={tarifs.min_price}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplément nuit (%)
                    </label>
                    <input
                      type="number"
                      name="night_surcharge_percent"
                      value={tarifs.night_surcharge_percent}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Appliqué entre 22h et 6h
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplément aéroport (€)
                    </label>
                    <input
                      type="number"
                      name="airport_surcharge"
                      value={tarifs.airport_surcharge}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seuil longue distance (km)
                    </label>
                    <input
                      type="number"
                      name="long_distance_threshold_km"
                      value={tarifs.long_distance_threshold_km}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Au-delà de cette distance, un supplément s'applique
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplément longue distance (%)
                    </label>
                    <input
                      type="number"
                      name="long_distance_surcharge_percent"
                      value={tarifs.long_distance_surcharge_percent}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission plateforme (%)
                    </label>
                    <input
                      type="number"
                      name="platform_commission_percent"
                      value={tarifs.platform_commission_percent}
                      onChange={handleTarifChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pourcentage prélevé sur chaque course
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Informations générales
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configurez les informations de l'entreprise
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={general.company_name}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      name="company_email"
                      value={general.company_email}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="company_phone"
                      value={general.company_phone}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      name="company_address"
                      value={general.company_address}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Méthodes de paiement
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Activez ou désactivez les méthodes de paiement disponibles
                </p>

                <div className="space-y-4">
                  {/* <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Paiement en espèces
                      </h3>
                      <p className="text-sm text-gray-600">
                        Les clients paient en espèces au chauffeur
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="cash_enabled"
                        checked={payments.cash_enabled}
                        onChange={handlePaymentChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div> */}

                  {/* <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Mobile Money
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paiement via Mobile Money (MTN, Orange, etc.)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="mobile_money_enabled"
                        checked={payments.mobile_money_enabled}
                        onChange={handlePaymentChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div> */}

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Carte bancaire
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paiement par carte bancaire (Visa, Mastercard)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      {/* <input
                        type="checkbox"
                        name="card_enabled"
                        checked={payments.card_enabled}
                        onChange={handlePaymentChange}
                        className="sr-only peer"
                      /> */}
                      {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div> */}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configurez les canaux de notification
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Notifications par email
                      </h3>
                      <p className="text-sm text-gray-600">
                        Envoyer des notifications par email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_email_notifications"
                        checked={notifications.send_email_notifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Notifications par SMS
                      </h3>
                      <p className="text-sm text-gray-600">
                        Envoyer des notifications par SMS
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_sms_notifications"
                        checked={notifications.send_sms_notifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Notifications push
                      </h3>
                      <p className="text-sm text-gray-600">
                        Envoyer des notifications push sur l'application
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="send_push_notifications"
                        checked={notifications.send_push_notifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;