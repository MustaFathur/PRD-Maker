import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center px-5 py-4 shadow-md bg-white">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src="https://media.licdn.com/dms/image/v2/D560BAQFXNWmkiLNccw/company-logo_200_200/company-logo_200_200/0/1708245223676?e=1740614400&v=beta&t=v-15F2A35whw0l7sQgVEdm3JaYVbDRA-v_6l42wYyYY"
          alt="Company Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span className="ml-3 text-xl font-semibold">PRD Maker</span>
      </div>

      {/* Button Section */}
      <div>
        <Link to="/register">
          <Button className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
