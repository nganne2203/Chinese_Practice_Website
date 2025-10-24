import { createBrowserRouter } from "react-router";
import { ROUTE_PATH } from "../constants/Routes";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import Unauthorized from "../pages/Unauthorized";
import DashboardOverview from "../components/admin/DashboardOverview";
import UserManagement from "../components/admin/UserManagement";
import LevelManagement from "../components/admin/LevelManagement";
import UnitManagement from "../components/admin/UnitManagement";
import LessonManagement from "../components/admin/LessonManagement";
import VocabularyManagement from "../components/admin/VocabularyManagement";
import QuizManagement from "../components/admin/QuizManagement";
import QuestionManagement from "../components/admin/QuestionManagement";
import RolePermissionManagement from "../components/admin/RolePermissionManagement";
import RoleBasedRedirect, { RequireAdmin, RequireUser } from "../components/auth/RoleBasedRedirect";

export const getProtectedRoutes = createBrowserRouter([
    {
        path: ROUTE_PATH.HOME,
        element: <RoleBasedRedirect />
    },
    {
        path: ROUTE_PATH.LOGIN,
        element: <RoleBasedRedirect />
    },
    {
        path: ROUTE_PATH.ADMIN,
        element: (
            <RequireAdmin>
                <AdminLayout />
            </RequireAdmin>
        ),
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
    },
    // User Routes
    {
        path: ROUTE_PATH.USER_DASHBOARD,
        element: (
            <RequireUser>
                <UserLayout />
            </RequireUser>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "lessons",
                element: <div>Lessons Coming Soon</div>
            },
            {
                path: "quizzes", 
                element: <div>Quizzes Coming Soon</div>
            },
            {
                path: "progress",
                element: <div>Progress Coming Soon</div>
            },
            {
                path: "profile",
                element: <div>Profile Coming Soon</div>
            }
        ]
    },
    // Legacy dashboard route for backward compatibility
    {
        path: ROUTE_PATH.DASHBOARD,
        element: (
            <RequireUser>
                <UserLayout />
            </RequireUser>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    },
    // Error pages
    {
        path: ROUTE_PATH.UNAUTHORIZED,
        element: <Unauthorized />
    },
    // Catch all route
    {
        path: "*",
        element: <NotFound />
    }
]);