import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ShopPage from "./components/ShopPage.jsx";
import "./styles.css";

const path = window.location.pathname;
const shopMatch = path.match(/^\/shop\/([a-zA-Z0-9-]+)/);

const RootComponent = shopMatch ? <ShopPage id={shopMatch[1]} /> : <App />;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{RootComponent}</React.StrictMode>
);