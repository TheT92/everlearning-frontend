import { useEffect } from "react";
import Input from "../components/input";

import '../styles/index.scss';
import Card from "../components/card";
import Button from "../components/button";

import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.png';
import { Link } from "react-router-dom";

export default function Index() {
    useEffect(() => {
        document.title = "EverLearning-Home";
        // fetchData();
    }, []);

    async function fetchData() {
        fetch('/api/').then(response => response.json())
            .then(data => {
                console.log('Data from /api/:', data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    return (
        <div className="page-container home-page">
            <div className="text-center welcome mt-4 mb-8">
                <h1 className="mt-0 mb-2 text-white fw-4">Welcome EverLearner!</h1>
                <p className="text-gray-600 mb-6 text-white">You can learn, teach, and grow through communication!</p>
                <Input type="text" className="search-bar" placeholder="Search here" />
            </div>
            <h3 className="mb-2 text-primary mt-0">Question of the day</h3>
            <Card className="text-center mb-8" title="What is the difference between Python and Java?">
                <Link to="problem/3"><Button className="">Answer the question</Button></Link>
            </Card>
            <h3 className="mb-2 text-primary">Recommendation for you</h3>
            <div className="recommendations">
                <Card className="recommendation-item">
                    <div className="card-img"></div>
                    <p className="mb-0">How to install Python</p>
                </Card>
                <Card className="recommendation-item">
                    <div className="card-img" style={{ background: `url(${img4}) 50% no-repeat` }}></div>
                    <p className="mb-0">Learn Java in 21 days</p>
                </Card>
                <Card className="recommendation-item">
                    <div className="card-img" style={{ background: `url(${img5}) 50% no-repeat` }}></div>
                    <p className="mb-0">Concurrency in Go</p>
                </Card>
            </div>
        </div>
    );
}