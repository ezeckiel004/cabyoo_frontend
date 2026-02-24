import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-[#150100] to-[#27a421]">
      {/* Carte de connexion avec effet de verre */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
        {/* En-tête avec logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-[#150100] to-[#27a421] rounded-2xl">
              <img
                src="/Cabyoo.jpeg"
                alt="CABYOO Logo"
                className="h-20 w-auto rounded-lg"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Bienvenue</h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre espace d'administration
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 text-red-700 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <p className="font-medium">Erreur de connexion</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27a421] focus:border-transparent transition-all duration-200"
                placeholder="exemple@email.com"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27a421] focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Lien mot de passe oublié */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-sm text-[#27a421] hover:text-[#150100] hover:underline transition-colors duration-200"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#150100] to-[#27a421] rounded-lg hover:from-[#27a421] hover:to-[#150100] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27a421] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

          {/* Identifiants par défaut dans une carte stylisée */}
          <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              🔑 Identifiants de démonstration :
            </p>
            <div className="space-y-1 text-sm">
              <p className="flex items-center text-gray-600">
                <span className="w-20 font-medium">Email:</span>
                <span className="text-[#27a421] font-mono">
                  admin@simcar.com
                </span>
              </p>
              <p className="flex items-center text-gray-600">
                <span className="w-20 font-medium">Mot de passe:</span>
                <span className="text-[#27a421] font-mono">admin123</span>
              </p>
            </div>
          </div>

          {/* Lien d'inscription (optionnel) */}
          <p className="text-center text-gray-600 text-sm">
            Vous n'avez pas de compte ?{" "}
            <button
              type="button"
              className="font-medium text-[#27a421] hover:text-[#150100] hover:underline transition-colors duration-200"
            >
              Contacter l'administrateur
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
