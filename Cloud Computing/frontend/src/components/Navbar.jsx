import React from "react";
import { motion } from "framer-motion"; // Import framer-motion

const Navbar = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 transition duration-300 ease-in-out"
      initial={{ opacity: 0, y: -50 }} // Animasi awal
      animate={{ opacity: 1, y: 0 }} // Animasi saat ditampilkan
      transition={{ duration: 0.5 }} // Durasi animasi
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl hover:text-gray-600 transition duration-300">
            PRD Maker
          </a>
        </div>
        <div className="flex-none gap-2 ml-4">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost hover:text-gray-600 transition duration-300"
            >
              Models
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <a className="hover:bg-gray-100 transition duration-300">
                  Gemini
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 transition duration-300">
                  Open AI
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User  Avatar"
                  src="https://media.licdn.com/dms/image/v2/D560BAQFXNWmkiLNccw/company-logo_200_200/company-logo_200_200/0/1708245223676?e=1740614400&v=beta&t=v-15F2A35whw0l7sQgVEdm3JaYVbDRA-v_6l42wYyYY"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <a className="justify-between hover:bg-gray-100 transition duration-300">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 transition duration-300">
                  Settings
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 transition duration-300">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
  
