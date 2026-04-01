import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";
import { extractGraphQLErrors, hasErrorCode } from "@/lib/errors";
import { ToastProvider } from "./contexts/ToastContext";
import App from "./App";

const wrapper = document.getElementById("app");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const errors = extractGraphQLErrors(error);
        if (hasErrorCode(errors, "UNAUTHORIZED")) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry(failureCount, error: any) {
        const errors = extractGraphQLErrors(error);
        if (hasErrorCode(errors, "UNAUTHORIZED")) return false;
        return failureCount < 2;
      },
    },
  },
});

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
      <SolidQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  ),
  wrapper,
);
