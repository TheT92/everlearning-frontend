import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGetProblemDetail } from "../apis/problem";
import { Button, Divider } from "antd";
import TextArea from "antd/es/input/TextArea";
export default function Problem() {
    const { uuid = '' } = useParams();
    const email = localStorage.getItem('email');

    const [problem, setProblem] = useState<any>({});


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        console.log(uuid, '00000000000000000000');
        apiGetProblemDetail(uuid).then(res => {
            setProblem({ ...res.data })
        }).catch(err => {
            console.log(err, '22222222222222222')
        })
    };

    return (
        <div className="page-container problem-page">
            <div className="d-flex">
                <div className="flex-1">
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                </div>
                <div className="flex-1">
                    <h3>You Answer</h3>
                    {
                        !email ? (
                            <div className="d-flex flex-column align-center justify-center mb-8">
                                <p>Please login to submit the answer.</p>
                                <Link to="/login"><Button>Go to Login Page</Button></Link>
                            </div>
                        ) : (
                            <div>
                                <TextArea rows={10}></TextArea>
                                <p>Your answer will be scored by AI based on the default answer.</p>
                                <Button type="primary">Submit</Button>
                            </div>
                        )
                    }
                    {/* <section className="pre-wrap">{problem.answer}</section> */}
                </div>
            </div>
        </div>
    );
}