import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Redux
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Navbar />
        <App />
        <Footer />
      </Router>
    </Provider>
  </React.StrictMode>
);
