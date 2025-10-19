import { Route } from "react-router";
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
