import mongoose from "mongoose";
mongoose.set('strictPopulate', false);

const postModel = new mongoose.Schema({
    datetime: {
        type: String,
        required: true,
    },

    action: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sentOneHourReminder: {
        type: Boolean,
    },
    sentFifteenMinutesReminder: {
        type: Boolean,
    },
},
{
    timestamps: true
}
);

export default mongoose.model('postModel', postModel);