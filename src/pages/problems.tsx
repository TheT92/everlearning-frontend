import { Link } from "react-router-dom";
import Button from "../components/button";
import Input from "../components/input";
import List from "../components/list";
import Pagination from "../components/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

import '../styles/problems.scss';
import { use, useEffect, useState } from "react";
import { apiGetCategories } from "../apis/category";

export default function Problems() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
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
        // Fetch problems data based on search params
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
            <Input type="text" className="search-bar" placeholder="Search here" />
            <p>
                {
                    categories.map((v:any, i) => (<Button key={i} className="search-button mb-2" outlined>{v.name}</Button>))
                }
            </p>
            <List className="problem-list">
                {
                    Array.from({ length: 10 }).map((_, index) => (
                        <List.Item className="problem-item" key={index}><Link className="full-width d-block" to={`/problem/${index + 1}`}>Item {index + 1}</Link></List.Item>
                    ))
                }
            </List>

            <Pagination onPageChange={onPageChange} data={{ currentPage: currentPage, total: 99 }} />
        </div>
    );
}