import React from "react";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Kontainer Utama */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        {/* Header Login */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Login</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Please login to access our services
          </p>
        </div>

        {/* Form Login */}
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

          {/* Input Password */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
            <RiLockPasswordLine className="text-gray-500 text-xl" />
            <input
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
              type="password"
              placeholder="Password"
            />
          </div>

          {/* Tombol Login */}
          <button className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-800 transition duration-300">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <p className="px-3 text-gray-500 text-sm shrink-0">or</p>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Login with Google */}
        <div className="flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
          <FaGoogle className="text-red-500 text-lg mr-2" />
          <p className="text-sm font-medium text-gray-600">
            Sign in with Google
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
