import { useAuth } from "@/contexts/AuthContext";
import { GraphQLClient } from "graphql-request";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function createGraphQLClient(token: string | null) {
  return new GraphQLClient(`${BACKEND_URL}/graphql`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

export function useGraphQLClient() {
  const { token } = useAuth();
  return createGraphQLClient(token());
}

export function handleGraphQlError(error: any, logout: () => void) {
  if (error?.response?.status === 401) {
    logout();
  }
}
