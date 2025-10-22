import { createBrowserRouter } from "react-router";
import { ROUTE_PATH } from "../constants/Routes";
import AdminLayout from "../layouts/AdminLayout";
import NotFound from "../pages/NotFound";
import DashboardOverview from "../pages/admin/DashboardOverview";
import UserManagement from "../pages/admin/UserManagement";
import LevelManagement from "../pages/admin/LevelManagement";
import UnitManagement from "../pages/admin/UnitManagement";
import LessonManagement from "../pages/admin/LessonManagement";
import VocabularyManagement from "../pages/admin/VocabularyManagement";
import QuizManagement from "../pages/admin/QuizManagement";
import QuestionManagement from "../pages/admin/QuestionManagement";
import RolePermissionManagement from "../pages/admin/RolePermissionManagement";
import ProtectedMainLayout from "../layouts/ProtectedMainLayout";

export const getProtectedRoutes = createBrowserRouter([
    {
        path: ROUTE_PATH.HOME,
        element: <ProtectedMainLayout />,
        children: [
            {
                path: ROUTE_PATH.NOT_FOUND,
                element: <NotFound />
            }
        ]
    },
    {
        path: ROUTE_PATH.ADMIN,
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <DashboardOverview />
            },
            {
                path: ROUTE_PATH.ADMIN_DASHBOARD,
                element: <DashboardOverview />
            },
            {
                path: ROUTE_PATH.ADMIN_USERS,
                element: <UserManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_LEVELS,
                element: <LevelManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_UNITS,
                element: <UnitManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_LESSONS,
                element: <LessonManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_VOCABULARIES,
                element: <VocabularyManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_QUIZZES,
                element: <QuizManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_QUESTIONS,
                element: <QuestionManagement />
            },
            {
                path: ROUTE_PATH.ADMIN_ROLES_PERMISSIONS,
                element: <RolePermissionManagement />
            }
        ]
    }
]);