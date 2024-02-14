// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAppContext } from "./AppContext";

const PrivateRoute = ({ element, ...props }) => {
  const { user } = useAppContext();

  return user ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
