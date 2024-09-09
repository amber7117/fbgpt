const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    pageId: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    sender_name: {
        type: String,
        required: true
    },
    sender_picture: {
        type: String,
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],
    lastUpdated: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Conversation', conversationSchema)