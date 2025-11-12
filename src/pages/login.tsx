import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import Input from "../components/input";
import { apiUserLogin } from "../apis/user";
import Tab from "../components/tab";

import '../styles/login.scss';
import Button from "../components/button";

export default function Login() {
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const data = {
            username: (e.target as any)[0].value,
            password: (e.target as any)[1].value,
        };
        console.log("Login data:", data);
        try {
            const response = await apiUserLogin(data);
            console.log("Login successful:", response.data);
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
                    <Input type="text" placeholder="Username" /><br />
                    <Input type="password" placeholder="Password" /><br />
                    <Button size="lg" type="submit">Login</Button>
                </form>
            </div>
        </div>

    );
}