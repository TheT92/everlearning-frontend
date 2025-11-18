import { Link, Navigate } from "react-router-dom";
import { apiUserSignup } from "../apis/user";
import Tab from "../components/tab";
import Input from "../components/input";
import Button from "../components/button";
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            email: formData.get('email') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            cpassword: formData.get('cpassword') as string,
        };
        if(!validateForm(data)) return false;
        console.log(data, '----------------------');
        apiUserSignup(data).then(response => {
            console.log("Signup successful:", response.data);
            const { user_id } = response.data;
            if(user_id) {
                navigate('/login');
            }
        }).catch(error => {
            console.error("Signup failed:", error);
        });
    };

    const validateForm = (formData: any) => {
        const {
            email,
            username,
            password,
            cpassword
        } = formData as any;
        const text = email || username || password || cpassword;
        if(text == null || text == '' || text == undefined) return false;
        if(password != cpassword) return false;
        return true;
    }

    return (
        <div className="page-container login-page">
            <div className="login-box">
                <Tab>
                    <Tab.Item><Link to="/login">Login</Link></Tab.Item>
                    <Tab.Item className="el-tab-active"><Link to="/signup">Signup</Link></Tab.Item>
                </Tab>
                <form onSubmit={handleSubmit}>
                    <Input name="email" type="email" placeholder="Email" /><br />
                    <Input name="username" type="text" placeholder="Username" /><br />
                    <Input name="password" type="password" placeholder="Password" /><br />
                    <Input name="cpassword" type="password" placeholder="Confirm Password" /><br />
                    <Button className="mt-8" size="lg" type="submit">Signup</Button>
                </form>
            </div>
        </div>
    );
}