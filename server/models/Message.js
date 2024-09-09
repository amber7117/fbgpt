const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    recipientId: {
        type: String,
        required: true
    },
    isSenderAgent: {
        type: Boolean,
        required: true,
        default: false
    },
    agentName: {
        type: String,
        required: false
    },
    messageId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Message', messageSchema);