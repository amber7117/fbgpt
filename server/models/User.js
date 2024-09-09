const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },
})

userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return done(err);
        }
        done(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema)