interface User {
  id: number;
  nom: string;
  email: string;
  entreprise: string;
  token: string;
}

interface LoginData {
  email: string,
  mot_de_passe: string
}

export interface RegisterData {
  nom: string;
  email: string;
  mot_de_passe: string;
  confirmPassword: string;
  entreprise: string;
}

export interface newError {
  nom?: string,
  email?: string,
  mot_de_passe?: string,
  confirmPassword?: string,
  terms?: string,
  submit?: string,
}

export interface AuthState {
  user: User | null;
  loginData: LoginData,
  registerData: RegisterData;
  isLoading: boolean;
  token: string | null,
  rememberMe: boolean,
  islogin: boolean,
  acceptTerms: boolean,
  errors: newError,

  login: (navigate:any) => void;
  register: (navigate:any) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setLoginData: (field: keyof LoginData, value: string) => void;
  setRegisterData: (field: keyof RegisterData, value: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
  setAcceptTerms: (  acceptTerms: boolean) => void;
  setErrors: (errors: newError)  => void;
}

export interface States{
  sidebarOpen: boolean,
  activeMenu: string, 
  
  setActiveMenu: (activeMenu: string) => void;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  syncActiveMenuFromURL: () => void; 
}