// src/App.tsx
import { Router, Route } from "@solidjs/router";
import { ProtectedRoute } from "./components/RouteGuards";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/login" component={Login} />
      <Route
        path="/dashboard"
        component={() => <ProtectedRoute component={Dashboard} />}
      />
      <Route
        path="/projects"
        component={() => <ProtectedRoute component={Projects} />}
      />
      {/* <Route */}
      {/*   path="/" */}
      {/*   component={() => <ProtectedRoute component={Dashboard} />} */}
      {/* /> */}
    </Router>
  );
}
