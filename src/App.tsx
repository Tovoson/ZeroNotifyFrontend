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
import Layout from "./pages/Layout";
import { Sms } from "./pages/Sms";
import { Historique } from "./pages/Historique";
import { Contacts } from "./pages/Contacts";
import { Dashboard } from "./pages/Dashboard";

// Composant de protection de route (pour s'assurer que l'utilisateur est connecté)
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{element}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-full w-full bg-gray-100">
        {/* Toaster pour les notifications */}
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Route protégée pour le tableau de bord */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/contact" element={<ProtectedRoute element={<Contacts />} />} />
          <Route path="/history" element={<ProtectedRoute element={<Historique />} />} />
          <Route path="/send-sms" element={<ProtectedRoute element={<Sms />} />} />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
