import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Check, Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { validateForm } from "../utils/validateur";

const Register: React.FC = () => {
  const [isvisible, setIsVisible] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    setRegisterData,
    errors,
    setErrors,
    registerData,
    register,
    isLoading,
    acceptTerms,
    setAcceptTerms,
  } = useAuthStore();
  const navigate = useNavigate();

  const toggleVisibility = () => {
    setIsVisible(!isvisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(registerData, acceptTerms);
    setErrors(validationErrors);

    if (!isValid) {
      return;
    }

    await register(navigate);
  };

  const getPasswordStrength = () => {
    const password = registerData.mot_de_passe;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Très faible", color: "bg-red-500" },
      { strength: 2, label: "Faible", color: "bg-orange-500" },
      { strength: 3, label: "Moyen", color: "bg-yellow-500" },
      { strength: 4, label: "Bon", color: "bg-blue-500" },
      { strength: 5, label: "Excellent", color: "bg-green-500" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo et Titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform hover:scale-110 transition-transform">
            <Zap className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Créer un compte
          </h1>
          <p className="text-white/80 text-lg">
            Rejoignez ZeroNotify en quelques clics
          </p>
        </div>

        {/* Carte d'inscription */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-semibold">
                {errors.submit}
              </p>
            </div>
          )}

          <div onSubmit={handleSubmit}>
            {/* Nom et Prénom */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nom*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={registerData.nom}
                  onChange={(e) => setRegisterData("nom", e.target.value)}
                  placeholder="Dupont"
                  className={`w-full text-slate-400 pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.nom
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-purple-500"
                    }`}
                />
              </div>
              {errors.nom && (
                <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
              )}
            </div>

            {/* Entreprise */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Entreprise (optionnel)
              </label>
              <div className="relative">
                <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={registerData.entreprise}
                  onChange={(e) => setRegisterData("entreprise", e.target.value)}
                  placeholder="entreprise"
                  className={`w-full text-slate-400 pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-purple-500"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData("email", e.target.value)}
                  placeholder="email@email.com"
                  className={`w-full pl-11 text-slate-400 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-purple-500"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={isvisible ? "text" : "password"}
                  value={registerData.mot_de_passe}
                  onChange={(e) =>
                    setRegisterData("mot_de_passe", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full pl-11 text-slate-400 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.mot_de_passe
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-purple-500"
                    }`}
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
              {errors.mot_de_passe && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mot_de_passe}
                </p>
              )}
              {registerData.mot_de_passe && passwordStrength.strength > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 text-slate-400 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-200 focus:ring-purple-500"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Conditions d'utilisation */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) setErrors({ terms: "" });
                    }}
                    className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  {acceptTerms && (
                    <Check className="w-3 h-3 text-white absolute pointer-events-none" />
                  )}
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  J'accepte les{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    politique de confidentialité
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Bouton d'inscription */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-sm hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création du compte...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </div>

          {/* Lien vers connexion */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Vous avez déjà un compte ?{" "}
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2025 ZeroNotify. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
