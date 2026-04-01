// src/contexts/ToastContext.tsx
import { createContext, useContext, JSX } from "solid-js";
import { toast } from "somoto";

type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>();

export function ToastProvider(props: { children: JSX.Element }) {
  const contextValue: ToastContextType = {
    success: (message: string) => {
      toast.success(message);
    },
    error: (message: string) => {
      toast.error(message);
    },
    warning: (message: string) => {
      toast.warning(message);
    },
    info: (message: string) => {
      toast.info(message);
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
