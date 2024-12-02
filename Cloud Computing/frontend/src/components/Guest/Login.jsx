import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include cookies in the request
            });

            if (response.status !== 200) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            if (data.redirectTo) {
                navigate(data.redirectTo);
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.message);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
                {/* Left Image Section */}
                <div 
                    className="hidden md:block md:w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/wallpaper.png)' }}
                ></div>

                {/* Right Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    {/* Logo */}
                    <div className="mb-4 text-center">
                        <Link to="/">
                            <img 
                                src="https://media.licdn.com/dms/image/v2/D560BAQFXNWmkiLNccw/company-logo_200_200/company-logo_200_200/0/1708245223676?e=1740614400&v=beta&t=v-15F2A35whw0l7sQgVEdm3JaYVbDRA-v_6l42wYyYY" 
                                alt="Logo"
                                className="h-12 mx-auto" 
                            />
                        </Link>
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h1>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input 
                                type="email" 
                                className="input input-bordered w-full" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        {/* Password Field */}
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input 
                                type="password" 
                                className="input input-bordered w-full" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        {/* Submit Button */}
                        <button type="submit" className="btn btn-neutral w-full">Login</button>
                    </form>

                    {error && <div className="mt-4 text-red-500">{error}</div>}

                    {/* Google Login */}
                    <div className="divider">OR</div>
                    <button 
                        type="button" 
                        className="btn btn-outline w-full btn flex items-center justify-center"
                        onClick={() => {
                            window.location.href = 'http://localhost:5000/api/auth/google';
                        }}
                    >
                        <img 
                            src="/images/google-logo.png" 
                            alt="Google Logo" 
                            className="h-6 w-6 mr-2"
                        />
                        Continue with Google
                    </button>

                    {/* Register Link */}
                    <div className="mt-4 text-center">
                        <span className="text-gray-700">Don’t have an account? </span>
                        <Link to="/register" className="text-blue-500">Register now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;