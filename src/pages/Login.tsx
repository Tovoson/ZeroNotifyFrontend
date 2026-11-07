import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isvisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isvisible);
  };

  const {
    login,
    isLoading,
    loginData,
    setLoginData,
  } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(navigate);
  };

  console.log(isLoading);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et Titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transform hover:scale-110 transition-transform">
            <Zap className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">ZeroNotify</h1>
          <p className="text-slate-500 text-lg">
            Bienvenue sur votre plateforme SMS
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="flex flex-col gap-4 bg-white rounded-2xl shadow-2xl p-8">
          <div onSubmit={handleSubmit} className="flex flex-col gap-4 py-3">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData("email", e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full pl-11 pr-4 py-3 text-gray-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={isvisible ? "text" : "password"}
                  value={loginData.mot_de_passe}
                  onChange={(e) => setLoginData("mot_de_passe", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isvisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Se souvenir & Mot de passe oublié */}
            {/* <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div> */}

            {/* Bouton de connexion */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 bg-blue-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-sm hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Connexion sociale */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-700">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700">
                Facebook
              </span>
            </button>
          </div>

          {/* Lien vers inscription */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Pas encore de compte ?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2025 ZeroNotify. Tous droits réservés.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Conditions
            </a>
            <span className="text-white/40">•</span>
            <a
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Confidentialité
            </a>
            <span className="text-white/40">•</span>
            <a
              href="#"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
