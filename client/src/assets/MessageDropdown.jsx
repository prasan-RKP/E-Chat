import React, { useState } from "react";
import { toast } from 'sonner';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, Forward, Copy, Pin, Trash2, Languages } from "lucide-react";
import TranslateModal from "../Components/openModals/TranslateModal.jsx";

const MessageDropdown = ({ message, onPinMessage, handleDeleteFromBoth, onForward, onClose, isDeleting }) => {
    // State for translate modal
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);

    // State management codes below
    const { users, isDeletingBoth } = useChatStore();
    const { authUser } = useAuthStore();

    console.log("Getting users from messageDropdown", users);

    // Check if current user can delete this message (only sender can delete for both)
    const canDelete = message.senderId === authUser?._id;

    // Copy functionality
    const handleCopy = async () => {
        console.log('received message', message);

        try {
            if (message.image) {
                // Fetch the image as a Blob and copy to clipboard
                const response = await fetch(message.image);
                const blob = await response.blob();
                await navigator.clipboard.write([
                    new ClipboardItem({ [blob.type]: blob }),
                ]);
            } else if (message.text) {
                await navigator.clipboard.writeText(message.text);
            }

            toast('Copied to the clipboard!', { icon: '🎾' });
        } catch (error) {
            console.error("Failed to copy:", error);
            toast('Failed to copy!', { icon: '❌' });
        }

        // Close dropdown after action
        onClose();
    };

    const handleSend = () => {
        console.log('Send/Forward message:', message);
        onForward(message);
        onClose();
    };

    const handlePin = () => {
        onPinMessage();
        onClose();
    };

    const handleTranslate = () => {
        if (!message.text) {
            toast.error('Cannot translate messages without text');
            onClose();
            return;
        }
        setIsTranslateModalOpen(true);
        //onClose(); // Close dropdown when opening modal
    };

    const handleDelete = async () => {
        if (!canDelete) {
            toast.error("You can only delete your own messages");
            onClose();
            return;
        }

        console.log(`Deleting message ${message?._id}`);
        
        try {
            await handleDeleteFromBoth();
            // onClose() will be called from the parent component after successful deletion
        } catch (error) {
            console.error("Failed to delete message:", error);
            onClose();
        }
    };

    // Check if any deletion operation is in progress
    const isDeletingInProgress = isDeleting || isDeletingBoth;

    return (
        <>
            <div
                className="flex flex-col gap-1 max-h-40 overflow-auto 
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            >
                {/* Translate Button */}
                <button
                    onClick={handleTranslate}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
                    disabled={isDeletingInProgress}
                >
                    <Languages className="w-4 h-4" />
                    Translate
                </button>

                {/* Forward Button */}
                <button
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
                    onClick={handleSend}
                    disabled={isDeletingInProgress}
                >
                   <Forward className="w-4 h-4" />
                   Forward
                </button>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
                    disabled={isDeletingInProgress}
                >
                    <Copy className="w-4 h-4" />
                    Copy
                </button>

                {/* Pin Button */}
                <button
                    onClick={handlePin}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
                    disabled={isDeletingInProgress}
                >
                    <Pin className="w-4 h-4" />
                    Pin
                </button>

                {/* Delete Button - Only show if user can delete */}
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeletingInProgress}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left ${
                            isDeletingInProgress 
                                ? 'text-red-400 bg-red-900/20 cursor-not-allowed opacity-60' 
                                : 'text-red-300 hover:bg-red-900/30'
                        }`}
                    >
                        {isDeletingInProgress ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete for everyone
                            </>
                        )}
                    </button>
                )}

                {/* Show message if user can't delete */}
                {!canDelete && (
                    <div className="px-3 py-2 text-xs text-gray-500 italic">
                        Only sender can delete for everyone
                    </div>
                )}
            </div>

            {/* Translate Modal */}
            <TranslateModal 
                isOpen={isTranslateModalOpen}
                onClose={() => setIsTranslateModalOpen(false)}
                message={message}
            />
        </>
    );
};

export default MessageDropdown;