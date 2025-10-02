import { Route } from "react-router-dom";
import Login from "../components/auth/Login";

export const getPublicRoutes = () => {
  return [
    <Route
      key="login"
      path="/login"
      element={<Login />} 
    />
  ];
};
