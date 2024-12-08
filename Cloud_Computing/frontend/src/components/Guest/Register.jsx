import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import api from '../../utils/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post('/auth/register', { name, email, password });

            if (response.status !== 201) {
                throw new Error('Registration failed');
            }

            const data = response.data;
            console.log('Registration successful:', data);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Error registering:', error);
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
            {/* Main Container */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
                {/* Header Signup */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2 text-sm">Join us to enjoy our exclusive features</p>
                </div>

                {/* Registration Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                        <CiUser className="text-gray-500 text-xl" />
                        <input
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                        <MdEmail className="text-gray-500 text-xl" />
                        <input
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                        <RiLockPasswordLine className="text-gray-500 text-xl" />
                        <input
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Register Button */}
                    <button className="w-full bg-black text-white rounded-full py-2 font-semibold hover:bg-gray-800 transition duration-300">
                        Register
                    </button>
                </form>

                {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <p className="px-3 text-gray-500 text-sm shrink-0">or</p>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Sign Up with Google */}
                <div className="flex items-center justify-center border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                        window.location.href = 'http://localhost:5000/api/auth/google';
                    }}>
                    <FaGoogle className="text-red-500 text-lg mr-2" />
                    <p className="text-sm font-medium text-gray-600">
                        Sign up with Google
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <Link to="/" className="text-blue-500 font-semibold hover:underline">
                            Return to Homepage
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;