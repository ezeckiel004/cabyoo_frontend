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
} from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("tarifs");
  const [loading, setLoading] = useState(false);

  // Tarifs
  const [tarifs, setTarifs] = useState({
    price_per_km: 500,
    min_price: 1000,
    night_surcharge_percent: 20,
    airport_surcharge: 500,
    long_distance_threshold_km: 20,
    long_distance_surcharge_percent: 10,
    platform_commission_percent: 20,
  });

  // Paramètres généraux
  const [general, setGeneral] = useState({
    company_name: "SIMCAR VTC",
    company_email: "contact@simcar.com",
    company_phone: "+237 6XX XXX XXX",
    company_address: "Yaoundé, Cameroun",
  });

  // Paiements
  const [payments, setPayments] = useState({
    cash_enabled: true,
    mobile_money_enabled: true,
    card_enabled: false,
  });

  const handleTarifChange = (e) => {
    const { name, value } = e.target;
    setTarifs((prev) => ({
      ...prev,
      [name]: parseFloat(value),
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

  const saveTarifs = async () => {
    try {
      setLoading(true);
      await adminAPI.updateTarifs(tarifs);
      alert("Tarifs mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "tarifs", label: "Tarifs", icon: FaEuroSign },
    { id: "general", label: "Général", icon: FaCog },
    { id: "payments", label: "Paiements", icon: FaCreditCard },
    { id: "notifications", label: "Notifications", icon: FaBell },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h1>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix au kilomètre (XAF)
                    </label>
                    <input
                      type="number"
                      name="price_per_km"
                      value={tarifs.price_per_km}
                      onChange={handleTarifChange}
                      className="input-field"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (XAF)
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      value={tarifs.min_price}
                      onChange={handleTarifChange}
                      className="input-field"
                      min="0"
                      step="100"
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
                      className="input-field"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplément aéroport (XAF)
                    </label>
                    <input
                      type="number"
                      name="airport_surcharge"
                      value={tarifs.airport_surcharge}
                      onChange={handleTarifChange}
                      className="input-field"
                      min="0"
                      step="100"
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
                      className="input-field"
                      min="0"
                      step="1"
                    />
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
                      className="input-field"
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
                      className="input-field"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={saveTarifs}
                    disabled={loading}
                    className="flex items-center btn-primary"
                  >
                    <FaSave className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer les tarifs"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Informations générales
                </h2>

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
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Mobile Money
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paiement via Mobile Money (MTN, Orange)
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Carte bancaire
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paiement par carte bancaire
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="card_enabled"
                        checked={payments.card_enabled}
                        onChange={handlePaymentChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                <p className="text-gray-600">
                  Configuration des notifications à venir...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
