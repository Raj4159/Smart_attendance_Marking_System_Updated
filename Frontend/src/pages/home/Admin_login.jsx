import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import cokkie from 'js-cookie';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);
    const navigate = useNavigate();
  
    const handleLogin = (e) => {
      e.preventDefault();
  
      // Check if the entered username and password match the fixed values
      if (username === "Admin" && password === "admin@123") {
        // Set login status to success
        setLoginStatus("success");
  
        // Simulate backend authentication by setting a token in cookies
        cokkie.set('bearerToken', 'mock_token');
  
        // Redirect to the home page after a delay   
        navigate("/Admin_Panel");
       
      } else {
        // Set login status to error
        setLoginStatus("error");
      }
    };

  return (
    <div className="flex items-center justify-center h-[calc(100vh - 64px)] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        <h2 className="text-center text-2xl font-bold leading-tight text-black">
          Enter Admin Credentials
        </h2>
        <form onSubmit={handleLogin} className="mt-8">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="text-base font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="text"
                  placeholder="Username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-base font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3.5 py-2.5 font-semibold leading-7 text-white"
              >
                Get Started <ArrowUpRight className="ml-2" size={16} />
              </button>
            </div>
            {loginStatus === "success" && (
              <p className="text-green-600 text-center">Login successful!</p>
            )}
            {loginStatus === "error" && (
              <p className="text-red-600 text-center">
                Login failed. Please try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;