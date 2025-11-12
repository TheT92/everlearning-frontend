import { useEffect } from "react";
import Input from "../components/input";

import '../styles/index.scss';
import Card from "../components/card";
import Button from "../components/button";

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
            <div className="text-center welcome mt-4">
                <h1 className="mt-0 mb-2">Welcome to the EverLearning Platform!</h1>
                <p className="text-gray-600 mb-6">You can learn, teach, and grow through communication!</p>
                <Input type="text" className="search-bar" placeholder="Search here" />
            </div>
            <h3 className="mb-2">Question of the day</h3>
            <Card className="" title="What is the difference between Python and Java?">
                <Button className="">Answer the question</Button>
            </Card>
            <h3 className="mb-2">Recommendation for you</h3>
            <div className="recommendations">
                <Card className="recommendation-item" title="How to install Python">
                    <p>123</p>
                    <p>23424</p>
                </Card>
                <Card className="recommendation-item" title="Learn Java in 21 days">
                    1234
                </Card>
                <Card className="recommendation-item" title="Concurrency in Go">
                    5678
                </Card>
            </div>
        </div>
    );
}