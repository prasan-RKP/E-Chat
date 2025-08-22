import React from "react";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  Loader,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });
  const { signup, isSigningIn } = useAuthStore();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validCredentials = () => {
    if (!formData.username.trim()) return toast.error("username required");
    if (!formData.email.trim()) return toast.error("E-mail required");
    if (!formData.contact) return toast.error("contact required");
    if (!formData.password.trim()) return toast.error("password required");

    if (formData.password.trim().length < 5)
      return toast.error("password must be at least 5 character");
    if (formData.contact.length < 10)
      return toast.error("contact must be at least 10 digit");
    if (!emailPattern.test(formData.email))
      return toast.error("Please enter a valid email");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validCredentials() === true) {
      signup(formData);
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
                <span className="label-text font-medium text-gray-400">
                  Username
                </span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="Your username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-400">
                  Email
                </span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-400">
                  Contact
                </span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="tel"
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="123-456-7890"
                  value={formData.contact}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-400">
                  Password
                </span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 text-gray-300 bg-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full bg-indigo-600 text-white py-2 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isSigningIn ? <LoaderCircle className="animate-spin" /> : 'Sign up'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an Account?{" "}
              <Link
                to={"/login"}
                className="link link-primary text-indigo-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center bg-opacity-20 text-white p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
        <MessageCircle className="animate-bounce h-20 w-20 mt-4" />
      </div>
    </div>
  );
};

export default SignUp;
