import { createBrowserRouter } from "react-router";
import { ROUTE_PATH } from "../constants/Routes";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import NotFound from "../pages/NotFound";
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
import UserDashboard from "../pages/user/UserDashboard";
import UserLessons from "../pages/user/UserLessons";
import UserQuizzes from "../pages/user/UserQuizzes";
import UserQuiz from "../pages/user/UserQuiz";
import UserProfile from "../pages/user/UserProfile";
import UserProgress from "../pages/user/UserProgress";
import UserUnits from "../pages/user/UserUnits";
import UserLessonDetail from "../pages/user/UserLessonDetail";
import UserUnitDetail from "../pages/user/UserUnitDetail";

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
                element: <UserDashboard />
            },
            {
                path: "units",
                element: <UserUnits />
            },
            {
                path: "units/:unitId",
                element: <UserUnitDetail />
            },
            {
                path: "lessons",
                element: <UserLessons />
            },
            {
                path: "lessons/:lessonId",
                element: <UserLessonDetail />
            },
            {
                path: "quizzes", 
                element: <UserQuizzes />
            },
            {
                path: "quiz/:quizId",
                element: <UserQuiz />
            },
            {
                path: "progress",
                element: <UserProgress />
            },
            {
                path: "profile",
                element: <UserProfile />
            }
        ]
    },
    {
        path: ROUTE_PATH.UNAUTHORIZED,
        element: <Unauthorized />
    },
    {
        path: ROUTE_PATH.NOT_FOUND,
        element: <NotFound />
    }
]);