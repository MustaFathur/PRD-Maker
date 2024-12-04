import React from "react";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";

const Signup = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Kontainer Utama */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        {/* Header Signup */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Join us to enjoy our exclusive features
          </p>
        </div>

        {/* Form Signup */}
        <form className="space-y-6">
          {/* Input Username */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <CiUser className="text-gray-500 text-xl" />
            <input
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              type="text"
              placeholder="Username"
            />
          </div>

          {/* Input Email */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <MdEmail className="text-gray-500 text-xl" />
            <input
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              type="email"
              placeholder="Email"
            />
          </div>

          {/* Input Password */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <RiLockPasswordLine className="text-gray-500 text-xl" />
            <input
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              type="password"
              placeholder="Password"
            />
          </div>

          {/* Tombol Register */}
          <button className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-800 transition duration-300">
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <p className="px-3 text-gray-500 text-sm shrink-0">or</p>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Sign Up with Google */}
        <div className="flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
          <FaGoogle className="text-red-500 text-lg mr-2" />
          <p className="text-sm font-medium text-gray-600">
            Sign up with Google
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
