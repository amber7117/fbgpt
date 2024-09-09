const User = require('../models/User');

module.exports = {
    getOrg: (req, res, next) => {
        User.findById(req.user._id).populate('organizationId').then(user => {
            req.user = user;
            next()
        })
    }
};