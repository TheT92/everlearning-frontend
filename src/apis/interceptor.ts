import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EXCLUDE_ROUTERS, STATUS_CODES } from '../../constants';
import { useEffect } from 'react';

export const useAuthInterceptor = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 请求拦截器
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const url = config.url || '';
                // 判断是否存在token,如果存在将每个页面header添加token
                if (!EXCLUDE_ROUTERS.includes(url)) {
                    if (localStorage.getItem("token")) {
                        config.headers.token = localStorage.getItem("token");
                    } else {
                        navigate('/login', { replace: true });
                    }
                }
                return config
            },
            error => Promise.reject(error)
        )

        // 响应拦截器
        const responseInterceptor = axios.interceptors.response.use(
        
        response => response,
        function (error) {
        const status = error.response?.status;
        switch (Number(status)) {
            case STATUS_CODES.UNAUTHORIZED:
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                break;
            default:
                return Promise.reject(error);
        }
    });

        // 清理拦截器
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);
};