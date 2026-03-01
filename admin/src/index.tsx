import "./index.css";
import { render } from "solid-js/web";
import { Route, Router, RouteSectionProps } from "@solidjs/router";
import Home from "./Home";

const wrapper = document.getElementById("app");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

const Layout = (props: RouteSectionProps<unknown>) => {
  return (
    <>
      <header>Header</header>
      {props.children}
      <footer>Footer</footer>
    </>
  );
};

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Home} />
    </Router>
  ),
  wrapper,
);
