import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            {/* Navbar */}
            <div className="navbar bg-base-100">
                {/* Navbar Start */}
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl">Algo Network</Link>
                </div>

                {/* Navbar End */}
                <div className="navbar-end rounded-t-none p-2">
                    <Link to="/login" className="btn btn-neutral m-2">Login</Link>
                    <Link to="/register" className="btn btn-neutral m-2">Register</Link>
                </div>
            </div>

            {/* Hero Section */}
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: "url(/images/image-background.jpg)",
                }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                        <p className="mb-5">
                            Our PRD Maker with LLM (Large Language Model) helps you create comprehensive Product Requirements Documents effortlessly. 
                            Streamline your product development process with AI-powered tools that ensure clarity, precision, and collaboration.
                        </p>
                        <button className="btn btn-neutral">Get Started</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;