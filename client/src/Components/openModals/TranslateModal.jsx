import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Loader2 } from "lucide-react";
import { useChatStore } from "../../store/useChatStore.js";
import { toast } from 'sonner';

const TranslateModal = ({ isOpen, onClose, message }) => {
    const { translateMessage, isTranslating } = useChatStore();
    const [translatedText, setTranslatedText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    // Available languages for translation
    const languages = [
        { code: "hi", name: "हिंदी", flag: "🇮🇳" },
        { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
        { code: "te", name: "తెలుగు", flag: "🇮🇳" },
        { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
        { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
        { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
        { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
        { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
        { code: "bn", name: "বাংলা", flag: "🇮🇳" },
        { code: "mr", name: "मराठी", flag: "🇮🇳" },
        { code: "en", name: "English", flag: "🇬🇧" },
    ];

    const handleTranslate = async () => {
        if (!selectedLanguage) {
            toast.error('Please select a language');
            return;
        }
        if (!message.text) {
            toast.error('No text to translate');
            return;
        }
        try {
            const result = await translateMessage({
                messageId: message._id,
                text: message.text,
                langCode: selectedLanguage
            });
            setTranslatedText(result.translatedText);
        } catch (error) {
            console.error('Translation failed:', error);
            toast.error('Translation failed. Please try again.');
        }
    };

    const handleClose = () => {
        setTranslatedText('');
        setSelectedLanguage('');
        onClose();
    };

    const handleLanguageSelect = (langCode) => {
        setSelectedLanguage(langCode);
        setTranslatedText('');
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: -50 },
        visible: {
            opacity: 1, scale: 1, y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2 } }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!message) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Languages className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-white">
                                    Translate Message
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-red-700  rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Original Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Original Message:
                                </label>
                                <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                                    <p className="text-gray-200 whitespace-pre-wrap break-words text-sm sm:text-base">
                                        {message.text}
                                    </p>
                                </div>
                            </div>

                            {/* Translated Message */}
                            {translatedText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-gray-300">
                                        Translated Message:
                                    </label>
                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                                        <p className="text-blue-100 whitespace-pre-wrap break-words text-sm sm:text-base">
                                            {translatedText}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Language Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300">
                                    Select Language:
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                    {languages.map((lang) => (
                                        <motion.button
                                            key={lang.code}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                                                selectedLanguage === lang.code
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <span className="text-base sm:text-lg">{lang.flag}</span>
                                                <span className="text-xs sm:text-sm font-medium">{lang.name}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-700">
                            <button
                                onClick={handleClose}
                                disabled={isTranslating}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-400 text-gray-300 rounded-lg  transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleTranslate}
                                disabled={isTranslating || !selectedLanguage}
                                className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                                    isTranslating || !selectedLanguage
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isTranslating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Translating...
                                    </>
                                ) : (
                                    <>
                                        <Languages className="w-4 h-4" />
                                        Translate
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TranslateModal;