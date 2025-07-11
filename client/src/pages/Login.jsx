import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { login } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidForm = () => {
    if (!formData.email.trim()) {
      toast.error("E-mail required");
      return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password required");
      return false;
    }
    if (formData.password.trim().length < 5) {
      toast.error("Password must be at least 5 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidForm()) {
      console.log("Login data submitted:", formData);
      login(formData);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-gradient-to-r from-slate-800 to-gray-900">
      <div className="flex flex-col justify-center items-center p-8 sm:p-16">
        <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-2xl transform transition-all duration-300 hover:shadow-inner">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-400">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-400">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full bg-indigo-600 text-white py-2 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              LogIn
            </button>
          </form>
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary text-indigo-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center bg-opacity-20 text-white p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-300">Welcome Back!</h2>
        <MessageCircle className="animate-bounce h-20 w-20 mt-4" />
      </div>
    </div>
  );
};

export default Login;
