import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Search, Check } from "lucide-react";
import { toast } from "sonner";
import { useChatStore } from "../../store/useChatStore";

const SendModal = ({ open, onClose, message }) => {
  const { users, sendMessage } = useChatStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Send to each selected user
      await Promise.all(
        selectedIds.map((receiverId) =>
          sendMessage({
            receiverId,
            text: message.text || "",
            image: message.image || null, // This will be the URL from database
          })
        )
      );

      toast.success(`Message forwarded to ${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''}`);
      setSelectedIds([]);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error('Error forwarding message:', error);
      toast.error("Failed to forward message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u._id));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Forward Message</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Preview */}
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <div className="text-sm text-gray-400 mb-2">Forwarding:</div>
              <div className="bg-gray-700 rounded-lg p-3 max-h-20 overflow-y-auto">
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Message content" 
                    className="w-12 h-12 rounded object-cover mb-2"
                  />
                )}
                <div className="text-sm text-gray-200 break-words">
                  {message.text || "📷 Image"}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Selection */}
            <div className="p-4">
              {/* Select All */}
              {filteredUsers.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="w-full text-left p-2 text-sm text-blue-400 hover:text-blue-300 mb-2"
                >
                  {selectedIds.length === filteredUsers.length ? 'Deselect All' : 'Select All'} ({filteredUsers.length})
                </button>
              )}

              {/* Users List */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <label
                      key={user._id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedIds.includes(user._id)
                          ? 'bg-blue-600/20 border border-blue-500/30'
                          : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user._id)}
                          onChange={() => toggleSelect(user._id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedIds.includes(user._id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedIds.includes(user._id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <img
                        src={user.profilePic || "/dfp.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {user.username}
                        </div>
                        {user.fullName && (
                          <div className="text-gray-400 text-sm truncate">
                            {user.fullName}
                          </div>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Selected Count */}
            {selectedIds.length > 0 && (
              <div className="px-4 pb-2">
                <div className="text-sm text-blue-400 bg-blue-500/10 rounded-lg px-3 py-2">
                  {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={selectedIds.length === 0 || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send {selectedIds.length > 0 && `(${selectedIds.length})`}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SendModal;