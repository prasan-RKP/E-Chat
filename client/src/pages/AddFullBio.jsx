import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
    X,
    User,
    Phone,
    MapPin,
    Heart,
    Link as LinkIcon,
    Save,
    Loader,
    Sparkles,
    Camera,
    Edit3,
    Loader2
} from 'lucide-react';
import {
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaHeart,
    FaLink,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaGithub
} from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore.js';
import { toast } from 'sonner';

const AddFullBio = ({ isOpen, onClose }) => {

    // Adding the stateManagement for the form fields

    const { authUser, isAddingFullBio, addFullBio } = useAuthStore();

    const [formData, setFormData] = useState({
        username: authUser?.username || '',
        contact: authUser?.contact || '',
        location: authUser?.location || '',
        passion: authUser?.passion || '',
        profileLink: authUser?.profileLink || ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);
    const formRef = useRef(null);



    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validate form
    // ...existing code...
    // Validate form
    const validateForm = () => {
        let valid = true;
        // const newErrors = {};

        // Username must be at least 3 characters
        if (!formData.username || formData.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters");
            valid = false;
        }

        // Contact must be exactly 10 digits (if filled)
        if (
            formData.contact &&
            (!/^\d{10}$/.test(formData.contact))
        ) {
            toast.error("Contact number must be exactly 10 digits");
            valid = false;
        }

        // Profile Link must be a valid URL if filled
        if (formData.profileLink && !isValidURL(formData.profileLink)) {
            toast.error("Please enter a valid URL");
            valid = false;
        }

        return valid;
    };
    // ...existing code...

    // URL validation helper
    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Shake animation for errors
            gsap.to(formRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.5,
                ease: "power2.out"
            });
            //toast.error("Something Wrong.. Check Your Credentials Properly..");
            return;
        }

        // form submission is here 

        console.log("Form Data Submitted:", formData);
        
        await addFullBio(formData);
        
        handleClose();
    };


    const formFields = [
        {
            name: 'username',
            label: 'Username',
            icon: User,
            reactIcon: FaUser,
            placeholder: 'Enter your username',
            type: 'text'
        },
        {
            name: 'contact',
            label: 'Contact',
            icon: Phone,
            reactIcon: FaPhone,
            placeholder: '+1 (555) 123-4567',
            type: 'number'
        },
        {
            name: 'location',
            label: 'Location',
            icon: MapPin,
            reactIcon: FaMapMarkerAlt,
            placeholder: 'City, Country',
            type: 'tel'
        },
        {
            name: 'passion',
            label: 'Passion',
            icon: Heart,
            reactIcon: FaHeart,
            placeholder: 'What drives you?',
            type: 'text'
        },
        {
            name: 'profileLink',
            label: 'Profile Link (Optional)',
            icon: LinkIcon,
            reactIcon: FaLink,
            placeholder: 'https://yourwebsite.com',
            type: 'url'
        }
    ];

    // Below things are we are not working now.

    // Handle close with animation
    const handleClose = () => {
        if (modalRef.current) {
            gsap.to(modalRef.current, {
                scale: 0.8,
                opacity: 0,
                rotateY: 15,
                duration: 0.3,
                ease: "power2.in",
                onComplete: onClose
            });
        } else {
            onClose();
        }
    };


    // GSAP animations
    useEffect(() => {
        if (isOpen && modalRef.current) {
            gsap.set(modalRef.current, { scale: 0.8, opacity: 0, rotateY: -15 });
            gsap.to(modalRef.current, {
                scale: 1,
                opacity: 1,
                rotateY: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });

            // Stagger form fields animation
            const formFields = formRef.current?.querySelectorAll('.form-field');
            if (formFields) {
                gsap.fromTo(formFields,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        stagger: 0.1,
                        delay: 0.3,
                        ease: "power2.out"
                    }
                );
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <div
                    ref={modalRef}
                    className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Edit3 size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Complete Your Bio 🍕</h2>
                                    <p className="text-purple-100 text-sm">Add more about yourself 🔥</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClose}
                                className="hover:cursor-pointer p-2 bg-white/20 hover:bg-red-600 rounded-full text-white transition-all duration-200"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Decorative elements */}
                        <div className="absolute top-20 right-4 text-purple-400/20">
                            <Sparkles size={24} />
                        </div>
                        <div className="absolute top-32 left-4 text-blue-400/20">
                            <Camera size={20} />
                        </div>

                        {formFields.map((field, index) => (
                            <motion.div
                                key={field.name}
                                className="form-field space-y-2"
                                whileHover={{ scale: 1.02 }}
                            >
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <field.reactIcon className={`text-purple-400`} size={16} />
                                    {field.label}
                                </label>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <field.icon
                                            size={18}
                                            className={`text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200`}
                                        />
                                    </div>

                                    <motion.input
                                        type={field.type}
                                        value={formData[field.name]}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-gray-800/70 transition-all duration-300 ${errors[field.name]
                                            ? 'border-red-500 bg-red-500/10'
                                            : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                        whileFocus={{ scale: 1.02 }}
                                    />

                                    {/* Field decoration */}
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${formData[field.name]
                                            ? 'bg-green-400 shadow-lg shadow-green-400/50'
                                            : 'bg-gray-600'
                                            }`} />
                                    </div>
                                </div>

                                {errors[field.name] && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs flex items-center gap-1"
                                    >
                                        <span className="w-1 h-1 bg-red-400 rounded-full" />
                                        {errors[field.name]}
                                    </motion.p>
                                )}
                            </motion.div>
                        ))}

                        {/* Social Media Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20"
                        >
                            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" />
                                Profile Preview
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">
                                        {formData.username || 'Your Username'}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {formData.location || 'Your Location'} • {formData.passion || 'Your Passion'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <motion.button
                                type="button"
                                onClick={handleClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-red-600 cursor-pointer text-gray-300 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${isAddingFullBio ? "cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {isAddingFullBio ? (
                                    <>
                                        Saving...
                                        <Loader2 size={18} className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Bio
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Footer decoration */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-b-2xl" />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddFullBio;