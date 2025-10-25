import { create } from "zustand";
import type { AuthState } from "../types/types";
import api from "../utils/api";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

const users = {
  id: 1,
  nom: "Tovo",
  email: "tovo@gmail.com",
  token: "eyJhbGciOi",
};

const initLoginData = {
  email: "", mot_de_passe: "" 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loginData: initLoginData,
      modemStatus: {
        isConnected: false,
        message: "Non vérifié",
        statusCode: "INIT",
      },
      isLoading: false,
      token: null,
      rememberMe: false,

      setLoginData: (field: string, value: string) => {
        set((state) => ({
          loginData: { ...state.loginData, [field]: value },
        }));
      },
      login: async (navigate: any) => {
        const { loginData } = get();
        set({ isLoading: true });
        
        
        if (!loginData.email || !loginData.mot_de_passe) {
          toast.error('Veuillez remplir tous les champs');
          set({ isLoading: false });
          return;
        }

        console.log("logindata", loginData);

        try {
          const response = await api.post("/auth/login", loginData);

          console.log("response : ", response);

          const user = {
            id: response.data.data.id,
            nom: response.data.data.nom,
            email: response.data.data.email,
            token: response.data.token, // Stockez le token pour les requêtes futures
          };

          set({ user, loginData: initLoginData });
          
          toast.success(`Bienvenue, ${user.nom} !`);
          navigate("/dashboard");
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Identifiants incorrects.";
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => set({ user: null }),
      setModemStatus: (status) => set({ modemStatus: status }),
      setLoading: (isLoading) => set({ isLoading }),
      setRememberMe: (rememberMe) => set({ rememberMe })
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
