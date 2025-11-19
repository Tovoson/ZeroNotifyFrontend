import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuthStore } from "./stores/authStore";
import { Sms } from "./pages/Sms";
import { Historique } from "./pages/Historique";
import { Contacts } from "./pages/Contacts";
import { Dashboard } from "./pages/Dashboard";
import Parametres from "./pages/Parametre";
import Services from "./pages/Service";
import TemplatesSMS from "./pages/Template";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";

// Composant de protection de route (pour s'assurer que l'utilisateur est connecté)
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{element}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {

  const { theme } = useTheme();
  
  // Debug
  useEffect(() => {
    console.log('Theme actuel:', theme);
    console.log('data-theme sur html:', document.documentElement.getAttribute('data-theme'));
  }, [theme]);

  return (
    <Router>
      <div className="h-full w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      
        {/* Toaster pour les notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Route protégée pour le tableau de bord */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/contact" element={<ProtectedRoute element={<Contacts />} />} />
          <Route path="/history" element={<ProtectedRoute element={<Historique />} />} />
          <Route path="/send-sms" element={<ProtectedRoute element={<Sms />} />} />
          <Route path="/parametre" element={<ProtectedRoute element={<Parametres />} />} />
          <Route path="/service" element={<ProtectedRoute element={<Services />} />} />
          <Route path="/template" element={<ProtectedRoute element={<TemplatesSMS />} />} />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
