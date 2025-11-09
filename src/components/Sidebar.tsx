import { ChevronRight, EllipsisVertical, LogOut, Menu, X, Zap } from "lucide-react";
import { menuItems } from "../data/datas";
import { useStores } from "../stores/stores";
import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";
import { useState } from "react";

export const SideBar = () => {
  const { sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu } = useStores();
  const { user, logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-linear-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 shadow-2xl ${sidebarOpen ? "w-64" : "w-20"
        }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div
          className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"
            }`}
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-lg">ZeroNotify</h2>
              <p className="text-xs text-slate-400">Service SMS</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item: any) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <Link
              to={item.path}
              key={item.path}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? "bg-linear-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50"
                : "hover:bg-slate-700/50"
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      {showLogout && (
        
        <button
          onClick={() => logout()}
          className="absolute w-11 mb-4 right-4 bottom-20 p-3 bg-slate-600 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2 shadow-lg"
        >
          <LogOut className="w-5 h-5" />
        </button>

      )}

      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">

            <div className="w-10 h-10 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user?.nom}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="p-2 hover:bg-slate-600/50 rounded-full transition-colors"
                aria-expanded={showLogout}
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
