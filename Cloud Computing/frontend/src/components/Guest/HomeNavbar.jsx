import React from "react";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
    return (
        <div className="navbar bg-base-100">
            {/* Navbar Start */}
            <div className="navbar-start">
            <Link to="/">
                <a class="btn btn-ghost text-xl">Algo Network</a>
            </Link>
            </div>

            {/* Navbar End */}
            <div className="navbar-end rounded-t-none p-2">
                <Link to="/login" className="btn btn-neutral m-2">
                    Login
                </Link>
                <Link to="/register" className="btn btn-neutral m-2">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default HomeNavbar;