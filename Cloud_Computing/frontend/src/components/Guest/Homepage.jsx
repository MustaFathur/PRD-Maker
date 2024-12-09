import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="bg-white text-base-content min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-white shadow-lg">
        {/* Navbar Start */}
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <img src="/images/Logo-Algo.jpeg" alt="Logo" className="h-12 w-12 rounded-full" />
          </Link>
          <h3 className='text-base font-medium'>Algo Network</h3>
        </div>

        {/* Navbar End */}
        <div className="navbar-end">
          <Link to="/login" className="btn btn-ghost m-2">Login</Link>
          <Link to="/register" className="btn btn-ghost m-2">Register</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to PRD Maker</h1>
            <p className="mb-5">
              Discover the tools and features to create amazing PRDs, collaborate
              with your team, and streamline your development process.
            </p>
            <Link to="/register">
              <button className="btn btn-neutral">Get Started</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16">
          <div className="card bg-neutral-focus shadow-xl">
            <div className="card-body">
              <h3 className="card-title">AI-Driven PRD Generation</h3>
              <p>Generate structured PRDs using LLM-powered optimization (Gemini API).</p>
            </div>
          </div>
          <div className="card bg-neutral-focus shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Editable Outputs</h3>
              <p>Ensure completeness and correctness with a real-time editor for the generated PRD.</p>
            </div>
          </div>
          <div className="card bg-neutral-focus shadow-xl"> 
            <div className="card-body">
              <h3 className="card-title">Downloadable PDF</h3>
              <p>Save finalized PRDs as styled PDF documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-16">
          <div className="card bg-neutral-focus shadow-xl">
            <div className="card-body">
              <p className="italic mb-4">"This platform transformed the way we create PRDs. Highly recommended!"</p>
              <h3 className="card-title">- John Doe</h3>
            </div>
          </div>
          <div className="card bg-neutral-focus shadow-xl">
            <div className="card-body">
              <p className="italic mb-4">"The collaboration tools are amazing. My team loves it!"</p>
              <h3 className="card-title">- Jane Smith</h3>
            </div>
          </div>
          <div className="card bg-neutral-focus shadow-xl"> 
            <div className="card-body">
              <p className="italic mb-4">"A must-have tool for every development team."</p>
              <h3 className="card-title">- Mark Lee</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer bg-base-100 text-base-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
      <div className="footer footer-center bg-base-100 text-base-content p-4">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by Algo Network Co</p>
        </aside>
      </div>
    </div>
  );
};

export default Homepage;