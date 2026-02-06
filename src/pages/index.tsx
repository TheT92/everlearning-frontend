import { useEffect } from "react";
import { Button, Card, Input } from "antd";
import Particles from "@/components/Particles";

import '../styles/index.scss';

import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.png';
import { Link } from "react-router-dom";

export default function Index() {
    useEffect(() => {
        document.title = "EverLearning-Home";
        fetchData();
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
            <div className="bg">
                <Particles
                    particleColors={["#000"]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover
                    alphaParticles={false}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>
            <div className="text-center welcome mt-8 mb-8">
                <h1 className="mt-0 mb-2 fw-7 fs-6">Welcome EverLearner!</h1>
                <p className="mb-6">Learn, teach, and grow through communication!</p>
                <Input type="search" className="search-bar" placeholder="Search here" />
            </div>
            <h3 className="mb-2 text-black mt-0 fs-3">Question of the day</h3>
            <Card className="text-center mb-8 fs-2 z-index-2 daily-question">
                <p className="mb-4 fs-2 fw-5 mt-0">What is the time complexity of binary search?</p>
                <Link to="problem/3"><Button className="">Attempt</Button></Link>
            </Card>
            <h3 className="mb-2 text-black mt-0 fs-3">Recommendation for you</h3>
            <div className="recommendations z-index-2">
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