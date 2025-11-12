import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import HomePage from '../pages/index.tsx';
import PageHeader from '../components/pageHeader.tsx';
import { useAuthInterceptor } from '../apis/interceptor.ts';

const Login = lazy(() => import('../pages/login.tsx'));
const Signup = lazy(() => import('../pages/signup.tsx'));
const Todo = lazy(() => import('../pages/todo.tsx'));
const Problems = lazy(() => import('../pages/problems.tsx'));
const Problem = lazy(() => import('../pages/problem.tsx'));
const Courses = lazy(() => import('../pages/courses.tsx'));


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
        useAuthInterceptor();
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/todo' element={<Todo />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/problems' element={<Problems />} />
                        <Route path='/problem/:id' element={<Problem />} />
                        <Route path='/courses' element={<Courses />} />
                    </Route>

                    
                    
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
