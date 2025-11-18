import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import { apiUserLogin } from "../apis/user";
import Tab from "../components/tab";

import '../styles/login.scss';
import Button from "../components/button";

export default function Login() {
    const navigate = useNavigate();
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const data = {
            email: (e.target as any)[0].value,
            password: (e.target as any)[1].value,
        };
        console.log("Login data:", data);
        try {
            const response = await apiUserLogin(data);
            console.log("Login successful:", response.data);
            const { token, prefix } = response.data
            localStorage.setItem('token', `${prefix} ${token}`);
            navigate('/', { replace: true })
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="page-container login-page">
            <div className="login-box">
                <Tab>
                    <Tab.Item className="el-tab-active"><Link to="/login">Login</Link></Tab.Item>
                    <Tab.Item><Link to="/signup">Signup</Link></Tab.Item>
                </Tab>
                <form onSubmit={handleLogin}>
                    <Input type="text" placeholder="Email" /><br />
                    <Input type="password" placeholder="Password" /><br />
                    <Button className="mt-8" size="lg" type="submit">Login</Button>
                </form>
            </div>
        </div>

    );
}