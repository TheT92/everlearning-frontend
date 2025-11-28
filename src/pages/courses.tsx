import { useEffect, useRef, useState } from "react";
import { Button, Card, Pagination, Table, type TableProps } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiGetCourses } from "../apis/course";

import '../styles/courses.scss';

export default function Index() {
    const navigate = useNavigate();
    const loaded = useRef(false);
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        document.title = "EverLearning-Courses";
        // fetchData();
    }, []);

    const onAddCourse = () => {
        navigate('/courses/add');
    }

    const onPageChange = (page: number) => {
        console.log("Page changed to:", page);
    }

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            const page = searchParams.get('page');
            const pageNumber = Number(page) < 1 ? 1 : Number(page);
            setCurrentPage(pageNumber);
            fetchData(pageNumber); // 直接传入计算出的 pageNumber
        }

    }, [searchParams]);

    const fetchData = (page = 1) => {
        apiGetCourses({ page: page, size: 10 }).then(res => {
            const { items, total } = res?.data;
            setTotal(total);
            setCourses(items);
        }).catch(err => {
            console.log(err, 'fetch error');
        })
    };

    return (
        <div className="page-container courses-page">
            <p>
                <Button onClick={onAddCourse} color="primary" variant="outlined">Contribute a course</Button>
            </p>
            <div className="course-list mb-4">
                {
                    courses.map((v: any, i) => (
                        <div className="course-item">
                            <Link to={`/course/${v.uuid}`}>
                                <Card key={i} size="small" className="d-flex align-center justify-center overflow-hidden">
                                    <h3 className="mt-0 mb-0 text-center fukk-width overflow-hidden">{v.title}</h3>
                                </Card>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <Pagination onChange={onPageChange} defaultCurrent={1} current={currentPage} total={total} />
        </div>
    );
}