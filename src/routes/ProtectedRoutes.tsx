import { createBrowserRouter } from "react-router";
import { ROUTE_PATH } from "../constants/Routes";
import MainLayout from "../layouts/PubLicMainLayout";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";

export const getProtectedRoutes = createBrowserRouter([
    {
        path: ROUTE_PATH.HOME,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Dashboard /> 
            },
            {
                path: ROUTE_PATH.DASHBOARD,
                element: <Dashboard />
            },
            {
                path: ROUTE_PATH.NOT_FOUND,
                element: <NotFound />
            }
        ]
    }
]);