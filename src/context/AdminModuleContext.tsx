import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router";

export type AdminModule = "shopping" | "mlm";

const STORAGE_KEY = "admin_active_module";

const SHOPPING_HOME = "/";
const MLM_HOME = "/admin/mlm";

interface AdminModuleContextValue {
  module: AdminModule;
  setModule: (module: AdminModule) => void;
  switchModule: (module: AdminModule) => void;
  isMlm: boolean;
  isShopping: boolean;
  homePath: string;
}

const AdminModuleContext = createContext<AdminModuleContextValue | null>(null);

function readStoredModule(): AdminModule {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "mlm" ? "mlm" : "shopping";
}

function moduleFromPath(pathname: string): AdminModule | null {
  if (pathname.startsWith("/admin/mlm")) return "mlm";
  if (
    pathname === "/" ||
    pathname.startsWith("/admin/") && !pathname.startsWith("/admin/mlm")
  ) {
    return "shopping";
  }
  return null;
}

export function AdminModuleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [module, setModuleState] = useState<AdminModule>(() => {
    const fromPath = moduleFromPath(window.location.pathname);
    return fromPath ?? readStoredModule();
  });

  useEffect(() => {
    const fromPath = moduleFromPath(location.pathname);
    if (fromPath && fromPath !== module) {
      setModuleState(fromPath);
      localStorage.setItem(STORAGE_KEY, fromPath);
    }
  }, [location.pathname, module]);

  const setModule = useCallback((next: AdminModule) => {
    setModuleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const switchModule = useCallback(
    (next: AdminModule) => {
      setModule(next);
      navigate(next === "mlm" ? MLM_HOME : SHOPPING_HOME);
    },
    [navigate, setModule]
  );

  const value = useMemo<AdminModuleContextValue>(
    () => ({
      module,
      setModule,
      switchModule,
      isMlm: module === "mlm",
      isShopping: module === "shopping",
      homePath: module === "mlm" ? MLM_HOME : SHOPPING_HOME,
    }),
    [module, setModule, switchModule]
  );

  return (
    <AdminModuleContext.Provider value={value}>
      {children}
    </AdminModuleContext.Provider>
  );
}

export function useAdminModule() {
  const ctx = useContext(AdminModuleContext);
  if (!ctx) {
    throw new Error("useAdminModule must be used within AdminModuleProvider");
  }
  return ctx;
}
