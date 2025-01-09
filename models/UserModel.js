import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    telegramId: { type: String, required: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true },
    chatId: { type: String, required: true, unique: true },
},
{
    timestamps: true
}
);

export default mongoose.model('userModel', userModel);