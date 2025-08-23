import React from "react";
import { toast } from 'react-hot-toast';

const MessageDropdown = ({ message, onPinMessage, removeMessage }) => {

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

            toast('Copied to the clipboard!', { icon: '🍾' });
        } catch (error) {
            console.error("Failed to copy:", error);
            toast('Failed to copy!', { icon: '❌' });
        }
    };

    return (
        <div
          className="flex flex-col gap-1 max-h-40 overflow-y-auto 
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
            <button className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Send
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
                Copy
            </button>
            <button className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Forward
            </button>
            <button
              onClick={onPinMessage}
              className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
                Pin
            </button>
            <button
              onClick={removeMessage}
              className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
                Delete
            </button>
            <button className="px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
                Share
            </button>
        </div>
    );
};

export default MessageDropdown;
