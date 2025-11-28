import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiGetCourseDetail } from "../apis/course";

import '../styles/course-detail.scss';
import { Button, Divider } from "antd";

export default function CourseDetail() {
    const navigate = useNavigate();
    const loaded = useRef(false);
    const { uuid = '' } = useParams();
    const [course, setCourse] = useState<any>({});

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            fetchData();
        }
    }, []);

    const fetchData = () => {
        apiGetCourseDetail(uuid).then(res => {
            setCourse({ ...res.data })
        }).catch(err => {
            console.error(err);
        })
    };

    return (
        <div className="page-container course-detail">
            <div className="course-detail-wrap">
                <h1 className="mt-0 mb-0">{course.title}</h1>
                <Divider></Divider>
                <section>{course.content}</section>
                <Divider></Divider>
                <div className="mt-0 responsive-flex">
                    <p className="mt-0 mb-0">
                        <span className="fs-2 fw-5 mr-2">Comments</span>
                        <span className="fs-1 fw-3 mr-4">214</span>
                    </p>
                    <p className="mt-0 mb-0">
                        <Button className="fs-1 fw-5 pl-1 pr-1" color="primary" variant="link">Hottest</Button>
                        <Divider vertical></Divider>
                        <Button className="fs-1 pl-1 pr-1" color="default" variant="link">Latest</Button>
                    </p>
                </div>
            </div>
        </div>
    );
}