// src/App.tsx
import { Router, Route } from "@solidjs/router";
import { ProtectedRoute } from "./components/RouteGuards";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import EditProject from "./pages/EditProject";

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/login" component={Login} />
      <Route
        path="/projects"
        component={() => <ProtectedRoute component={Projects} />}
      />
      <Route
        path="/projects/new"
        component={() => <ProtectedRoute component={NewProject} />}
      />
      <Route
        path="/projects/:id/edit"
        component={() => <ProtectedRoute component={EditProject} />}
      />
      <Route
        path="/"
        component={() => <ProtectedRoute component={Dashboard} />}
      />
    </Router>
  );
}
