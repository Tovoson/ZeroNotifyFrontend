interface User {
  id: number;
  nom: string;
  email: string;
  token: string;
}

interface ModemStatus {
  isConnected: boolean;
  message: string;
  statusCode: string;
}

export interface AuthState {
  user: User | null;
  modemStatus: ModemStatus;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setModemStatus: (status: ModemStatus) => void;
  setLoading: (loading: boolean) => void;
}

export interface States{
  sidebarOpen: boolean,
  activeMenu: string, 
  
  setActiveMenu: (activeMenu: string) => void;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}