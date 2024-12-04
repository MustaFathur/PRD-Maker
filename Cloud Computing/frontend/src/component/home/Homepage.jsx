import React from "react";
import Header from "../ui/navbar/Header";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-white to-gray-100">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-gray-800">PRD Maker</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the tools and features to create amazing PRDs, collaborate
          with your team, and streamline your development process.
        </p>
        <Link to="/register">
          <button className="mt-8 px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-900 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Easy Collaboration</h3>
            <p className="text-gray-600">
              Work with your team in real time with our collaborative tools.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Customizable PRDs</h3>
            <p className="text-gray-600">
              Create PRDs tailored to your project requirements.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
            <p className="text-gray-600">
              Integrate with your favorite tools to boost productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-black text-white">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16">
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <p className="italic mb-4">
              "This platform transformed the way we create PRDs. Highly
              recommended!"
            </p>
            <h3 className="text-sm font-semibold text-gray-400">- John Doe</h3>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <p className="italic mb-4">
              "The collaboration tools are amazing. My team loves it!"
            </p>
            <h3 className="text-sm font-semibold text-gray-400">
              - Jane Smith
            </h3>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <p className="italic mb-4">
              "A must-have tool for every development team."
            </p>
            <h3 className="text-sm font-semibold text-gray-400">- Mark Lee</h3>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>&copy; 2024 Your Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
