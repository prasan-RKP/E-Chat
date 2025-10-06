import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import {Link} from 'react-router-dom';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Password reset:", { password, confirmPassword });
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left side - Image Carousel */}
            {/* Left side - Image Carousel */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 z-10" />

                {/* Content Container */}
                <div className="relative z-20 flex flex-col items-center justify-center px-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Swiper
                            modules={[Autoplay, EffectFade]}
                            effect="fade"
                            loop
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            className="w-full"
                        >
                            <SwiperSlide>
                                <motion.img
                                    src="/forgot.png"
                                    alt="Reset Password"
                                    className="object-contain w-96 h-96 mx-auto drop-shadow-2xl"
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 2, 0, -2, 0]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </SwiperSlide>
                        </Swiper>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-center mt-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Secure Password Reset
                        </h1>
                        <p className="text-white/90 text-lg max-w-md leading-relaxed">
                            Create a strong new password to protect your account.
                            Make sure it's unique and memorable.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Reset Password Form */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12"
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
                        <p className="text-gray-600">Enter your new password below</p>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-black px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full text-black px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all"
                            >
                                Update Password
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
