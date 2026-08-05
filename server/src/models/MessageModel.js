const mongoose = require("mongoose");

const messageModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    text: {
        type: String,
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    delivered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('Message', messageModel);