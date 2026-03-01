import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import Home from "@/pages/Home";
import Layout from "@/Layout";

const wrapper = document.getElementById("app");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Home} />
    </Router>
  ),
  wrapper,
);
