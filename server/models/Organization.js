const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    pageId: {
        type: String,
        required: true
    },
    pageName: {
        type: String,
        required: true
    },
    pageAccessToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Organization', organizationSchema)