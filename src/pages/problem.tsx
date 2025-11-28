import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiGetProblemDetail } from "../apis/problem";
import { Button, Divider, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
    LeftOutlined,
    RightOutlined
} from '@ant-design/icons';

import '../styles/problem-detail.scss';

export default function Problem() {
    const navigate = useNavigate();
    const loaded = useRef(false);
    const { uuid = '' } = useParams();
    const email = localStorage.getItem('email');
    const [problem, setProblem] = useState<any>({});
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            fetchData();
        }
    }, []);

    const fetchData = () => {
        apiGetProblemDetail(uuid).then(res => {
            setProblem({ ...res.data })
        }).catch(err => {
            console.error(err);
        })
    };

    const toogleProblem = (id: string) => {
        navigate(`/problem/${id}`);
    }

    return (
        <div className="page-container problem-detail">
            <div className="d-flex problem-wrap">
                <div className="flex-1">
                    <div className="d-flex mb-4">
                        <Tooltip title="Previous Problem">
                            <Button onClick={() => toogleProblem(problem.prev_id)} disabled={problem.prev_id == null || problem.prev_id == undefined} type="primary" className="mr-4">
                                <LeftOutlined />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Next Problem">
                            <Button onClick={() => toogleProblem(problem.next_id)} disabled={problem.next_id == null || problem.next_id == undefined} type="primary">
                                <RightOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                </div>
                <div className="ml-4 mr-4"><Divider vertical className="full-height"></Divider></div>
                <div className="flex-1">
                    <h3>Your Answer</h3>
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
                                <p>
                                    <Button type="primary" className="mr-4">Submit</Button>
                                    <Button onClick={() => setShowAnswer(!showAnswer)} type="primary">{showAnswer ? 'Hide' : 'Show'} Answer</Button>
                                </p>
                                {
                                    showAnswer ?
                                        <section className="pre-wrap">
                                            <h3 className="mt-0 mb-4">Default Answer</h3>
                                            {problem.answer}
                                        </section> :
                                        null
                                }
                            </div>
                        )
                    }
                    {/* <section className="pre-wrap">{problem.answer}</section> */}
                </div>
            </div>
        </div>
    );
}