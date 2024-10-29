import { createRoot } from "react-dom/client";
import "./index.css";
import * as React from "react";
import "./index.css";
import { App } from "./screens/App.tsx";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";
import { useMemo } from "react";
import { useVm } from "@/lib/utils.ts";

type Stores = {
  authStore: AuthStore;
};
const ctx = React.createContext<Stores | null>(null);
const StoresProvider = ({ children }: { children: React.ReactNode }) => {
  const stores = useMemo(() => {
    return {
      authStore: new AuthStore(),
    } satisfies Stores;
  }, []);

  return <ctx.Provider value={stores}>{children}</ctx.Provider>;
};
export const useStores = () => useVm(ctx);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoresProvider>
      <App />
    </StoresProvider>
  </React.StrictMode>,
);
