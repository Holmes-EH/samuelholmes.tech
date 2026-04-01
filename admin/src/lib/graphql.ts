import { useAuth } from "@/contexts/AuthContext";
import { GraphQLClient } from "graphql-request";

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8000/graphql";

export function createGraphQLClient(token: string | null) {
  return new GraphQLClient(GRAPHQL_URL, {
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
