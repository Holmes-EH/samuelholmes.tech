import { Component } from "solid-js";
import { Navigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute(props: { component: Component }) {
  const { isAuthenticated } = useAuth();

  return (
    <>{isAuthenticated() ? <props.component /> : <Navigate href="/login" />}</>
  );
}
