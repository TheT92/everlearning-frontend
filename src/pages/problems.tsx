import { Link } from "react-router-dom";
import Button from "../components/button";
import Input from "../components/input";
import List from "../components/list";
import { Pagination, Divider } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

import '../styles/problems.scss';
import { use, useEffect, useState } from "react";
import { apiGetCategories } from "../apis/category";
import { apiGetProblems } from "../apis/problem";

export default function Problems() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [total, setTotal] = useState(0);
    const [problems, setProblems] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([])



    useEffect(() => {
        const page = searchParams.get('page');
        setCurrentPage(Number(page) < 1 ? 1 : Number(page));
        console.log(`current page number: ${currentPage}`)
        fetchData();
        getProblemCategories()
    }, [searchParams]);

    const fetchData = () => {
        apiGetProblems({ page: currentPage, size: 10 }).then(res => {
            const {
                items,
                total,
            } = res?.data
            setTotal(total);
            setProblems(items);
        }).catch(err => {
            console.log(err, '22222222222222222')
        })
    };

    const getProblemCategories = () => {
        apiGetCategories().then(res => {
            setCategories(res.data?.data)
        }).catch(err => {
            console.log("error", err)
        })
    }

    const onPageChange = (page: number) => {
        console.log("Page changed to:", page);
        navigate(`/problems?page=${page}`);
    }

    return (
        <div className="page-container problems-page">
            <Input type="text" className="search-bar mb-8" placeholder="Search here" />
            <p className="mb-0">
                {
                    categories.map((v:any, i) => (<Button key={i} className="search-button mb-2" outlined>{v.name}</Button>))
                }
            </p>
            <Divider></Divider>
            <List className="problem-list">
                {
                    problems.map((v, i) => (
                        <List.Item className="problem-item" key={i}><Link className="full-width d-block" to={`/problem/${v.uuid}`}>{v.title}</Link></List.Item>
                    ))
                }
            </List>
            <Pagination align="center" onChange={onPageChange} current={currentPage} total={total} />
        </div>
    );
}