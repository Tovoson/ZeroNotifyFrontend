interface User {
  id: number;
  nom: string;
  email: string;
  token: string;
}

interface LoginData {
  email: string,
  mot_de_passe: string
}

interface ModemStatus {
  isConnected: boolean;
  message: string;
  statusCode: string;
}


export interface AuthState {
  user: User | null;
  loginData: LoginData,
  modemStatus: ModemStatus;
  isLoading: boolean;
  token: string | null,
  rememberMe: boolean,

  login: (navigate:any) => void;
  logout: () => void;
  setModemStatus: (status: ModemStatus) => void;
  setLoading: (loading: boolean) => void;
  setLoginData: (field: keyof LoginData, value: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
}

export interface States{
  sidebarOpen: boolean,
  activeMenu: string, 
  
  setActiveMenu: (activeMenu: string) => void;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  syncActiveMenuFromURL: () => void; 
}