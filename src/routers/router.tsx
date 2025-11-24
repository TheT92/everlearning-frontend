import { Suspense, lazy, type ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import HomePage from '../pages/index.tsx';
import PageHeader from '../components/pageHeader.tsx';
import { useAuthInterceptor } from '../apis/interceptor.ts';
import { useAuth } from '../hooks/useAuth.ts';

const Login = lazy(() => import('../pages/login.tsx'));
const Signup = lazy(() => import('../pages/signup.tsx'));
const Todo = lazy(() => import('../pages/todo.tsx'));
const Problems = lazy(() => import('../pages/problems.tsx'));
const Problem = lazy(() => import('../pages/problem.tsx'));
const Courses = lazy(() => import('../pages/courses.tsx'));

interface ProtectedRouteProps {
    children: ReactNode;
}

function AppRouter() {
    const MainLayout = () => {
        return (
            <div>
                <PageHeader />
                <Outlet /> {/* 渲染子路由页面 */}
            </div>
        );
    };



    const AppRoutes = () => {
        const auth = useAuth();

        // 使用拦截器，传入 auth 对象
        useAuthInterceptor(auth);

        // 路由守卫组件
        const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
            const { isAuthenticated, loading } = useAuth();
            const location = useLocation();

            if (loading) {
                return <div>Loading...</div>;
            }

            if (!isAuthenticated) {
                // 只传递路径，而不是整个 location 对象
                return <Navigate to="/login" replace state={{ from: location.pathname }} />;
            }

            return <>{children}</>;
        };

        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                        <Route path='/todo' element={<ProtectedRoute><Todo /></ProtectedRoute>} />
                        <Route path='/problems' element={<ProtectedRoute><Problems /></ProtectedRoute>} />
                        <Route path='/problem/:id' element={<ProtectedRoute><Problem /></ProtectedRoute>} />
                        <Route path='/courses' element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                    </Route>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>
            </Suspense>
        )
    }
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
export default AppRouter;

