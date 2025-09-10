import mongoose from "mongoose";

const userSeessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        loginTime: {
            type:Date,
            required: true,
            default: Date.now,
        },

        logoutTime: {
            type: Date,
            default: null
        },
        durationMinutes: {
            type: Number,
            default: 0, // Will be calculated later at logout
        }
    },
    {timestamps: true}
);

const UserSession = mongoose.model('UserSession', userSeessionSchema);
export default UserSession;