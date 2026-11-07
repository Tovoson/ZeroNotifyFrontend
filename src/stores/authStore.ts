import { create } from "zustand";
import type { AuthState } from "../types/types";
import api from "../utils/api";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

const initLoginData = {
  email: "",
  mot_de_passe: "",
};

const initRegisterData = {
  nom: "",
  mot_de_passe: "",
  email: "",
  entreprise: "",
  confirmPassword: "",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loginData: initLoginData,
      registerData: initRegisterData,
      isLoading: false,
      token: null,
      rememberMe: false,
      islogin: true,
      acceptTerms: false,
      errors: {},

      setLoginData: (field: string, value: string) => {
        set((state) => ({
          loginData: { ...state.loginData, [field]: value },
        }));
      },
      setRegisterData: (field: string, value: string) => {
        set((state) => ({
          registerData: { ...state.registerData, [field]: value },
        }));
      },
      login: async (navigate) => {
        const { loginData } = get();
        set({ isLoading: true });

        if (!loginData.email || !loginData.mot_de_passe) {
          toast.error("Veuillez remplir tous les champs");
          set({ isLoading: false });
          return;
        }

        console.log("logindata", loginData);

        try {
          // const response = await api.post("/auth/login", loginData);

          // const user = {
          //   id: response.data.data.id,
          //   nom: response.data.data.nom,
          //   email: response.data.data.email,
          //   entreprise: response.data.data.entreprise,
          //   token: response.data.token,
          // };

          const user = {
            id: 1,
            nom: "tovo",
            email: "tovo@gmail.com",
            entreprise: "Tovo Entreprise",
            token: "eyJhbGciOi",
          };

          set({ user, loginData: initLoginData });

          toast.success(`Bienvenue, ${user.nom} !`);
          navigate("/dashboard");
        } catch (error) {
          const message =
            error.response?.data?.message || "Identifiants incorrects.";
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (navigate) => {
        const {registerData} = get()

        const user = {
          nom: registerData.nom,
          email: registerData.email,
          mot_de_passe: registerData.mot_de_passe,
          entreprise: registerData.entreprise
        }

        console.log(user);
        try {
          set({ isLoading: true });

          const response = await api.post("/auth/signup", user);

          console.log(response.data);
          toast.success("Inscription réussie ! Veuillez vous connecter.");
          navigate("/login");
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Échec de l'inscription.";
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({ user: null })
        localStorage.removeItem('app-store');
      },
      setLoading: (isLoading) => set({ isLoading }),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      setAcceptTerms: (acceptTerms) => set({ acceptTerms }),
      setErrors: (errors) => {
        set({errors: errors});
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        //token: state.token,
      }),
    }
  )
);
