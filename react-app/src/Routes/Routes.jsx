import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "../pages/SignIn";
import VerifyCertificates from "../pages/Certificates/VerifyCertificate";
import Certificates from "../pages/Certificates/Certificates";

import { ContextProvider } from "../providers/ContextProvider";
import NotificationProvider from "../providers/NotificationProvider";

const RoutesGlobal = () => {
  return (
    <Router>
      <NotificationProvider>
        <ContextProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<SignIn />} />
            <Route
              path="/verify-certificate"
              element={<VerifyCertificates />}
            />
            <Route path="/certificates" element={<Certificates />} />
          </Routes>
        </ContextProvider>
      </NotificationProvider>
    </Router>
  );
};

export default RoutesGlobal;
