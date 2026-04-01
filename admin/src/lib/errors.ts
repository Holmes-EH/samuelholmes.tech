import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export type GraphQLErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_INPUT"
  | "DATABASE_ERROR"
  | "SERVER_ERROR";

export interface GraphQLErrorExtensions {
  code: GraphQLErrorCode;
}

export interface GraphQLError {
  message: string;
  extensions?: GraphQLErrorExtensions;
}

export interface GraphQLResponse {
  errors?: GraphQLError[];
}

export function extractGraphQLErrors(error: any): GraphQLError[] {
  return error?.response?.errors || [];
}

export function hasErrorCode(
  errors: GraphQLError[],
  code: GraphQLErrorCode,
): boolean {
  return errors.some((err) => err.extensions?.code === code);
}

export function getErrorMessage(errors: GraphQLError[]): string {
  if (errors.length === 0) return "An unknown error occurred";
  return errors[0].message;
}

export function useErrorHandler() {
  const { logout } = useAuth();
  const toast = useToast();

  return (error: any, customMessage?: string) => {
    const errors = extractGraphQLErrors(error);

    // Handle unauthorized - logout
    if (hasErrorCode(errors, "UNAUTHORIZED")) {
      toast.error("Session expired. Please login again.");
      logout();
      return;
    }

    // Handle other errors with toast
    const errorMessage = customMessage || getErrorMessage(errors);

    if (hasErrorCode(errors, "NOT_FOUND")) {
      toast.error(errorMessage);
    } else if (hasErrorCode(errors, "INVALID_INPUT")) {
      toast.warning(errorMessage);
    } else if (hasErrorCode(errors, "DATABASE_ERROR")) {
      toast.error("Database error. Please try again.");
    } else if (hasErrorCode(errors, "SERVER_ERROR")) {
      toast.error("Server error. Please contact support.");
    } else {
      // Unknown error
      toast.error(errorMessage);
    }
  };
}
