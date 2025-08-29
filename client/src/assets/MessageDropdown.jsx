import React from "react";
import { toast } from 'sonner';
import { useChatStore } from "../store/useChatStore";

const MessageDropdown = ({ message, onPinMessage, removeMessage, onForward, onClose }) => {

    // State management codes below
    const { users } = useChatStore();

    console.log("Getting users from messageDropwdow", users);

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

            toast('Copied to the clipboard!', { icon: '🏾' });
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

    const handleDelete = () => {
        removeMessage();
        onClose();
    };

    return (
        <div
            className="flex flex-col gap-1 max-h-40 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
            <button 
                className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
                onClick={handleSend}
            >
                Forward
            </button>
            <button
                onClick={handleCopy}
                className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
            >
                Copy
            </button>
            <button
                onClick={handlePin}
                className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors text-left"
            >
                Pin
            </button>
            <button
                onClick={handleDelete}
                className="px-3 py-2 text-red-300 hover:bg-red-900/30 rounded-md transition-colors text-left"
            >
                Delete
            </button>
        </div>
    );
};

export default MessageDropdown;