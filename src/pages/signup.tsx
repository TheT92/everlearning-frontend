import { Link } from "react-router-dom";
import { apiUserSignup } from "../apis/user";
import Tab from "../components/tab";
import Input from "../components/input";
import Button from "../components/button";
export default function Signup() {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            username: (e.target as any)[0].value,
            password: (e.target as any)[1].value,
            email: (e.target as any)[2].value,
        };
        console.log("Signup data:", data);
        apiUserSignup(data).then(response => {
            console.log("Signup successful:", response.data);
        }).catch(error => {
            console.error("Signup failed:", error);
        });
    };

    return (
        <div className="page-container login-page">
            <div className="login-box">
                <Tab>
                    <Tab.Item><Link to="/login">Login</Link></Tab.Item>
                    <Tab.Item className="el-tab-active"><Link to="/signup">Signup</Link></Tab.Item>
                </Tab>
                <form onSubmit={handleSubmit}>
                    <Input type="text" placeholder="Username" /><br />
                    <Input type="password" placeholder="Password" /><br />
                    <Input type="password" placeholder="Confirm Password" /><br />
                    <Input type="email" placeholder="Email" /><br />
                    <Button size="lg" type="submit">Signup</Button>
                </form>
            </div>
        </div>
    );
}