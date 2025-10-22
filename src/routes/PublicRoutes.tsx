import { createBrowserRouter } from "react-router";
import { ROUTE_PATH } from "../constants/Routes";
import PublicMainLayout from "../layouts/PubLicMainLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Login from "../pages/Login";

export const getPublicRoutes = createBrowserRouter([
    {
        path: ROUTE_PATH.HOME,
        element: <PublicMainLayout />,
        children: [
            {
                index: true, 
                element: <Home />
            },
            {
                path: ROUTE_PATH.LOGIN,
                element: <Login />
            },
            {
                path: ROUTE_PATH.REGISTER,
                element: <Register />
            },
            {
                path: ROUTE_PATH.NOT_FOUND,
                element: <NotFound />
            }
        ]
    }
]);
