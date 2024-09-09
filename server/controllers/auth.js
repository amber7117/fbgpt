const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { generateToken } = require("../services/jwt")


module.exports = {
    registerUser: (req, res) => {
        if(req.body.email && req.body.password && req.body.name) {
            User.findOne({ email: req.body.email }).then((user) => {
                if(user && user.password != null) {
                    res.status(400).json({ success: false, message: "User already exists" })
                }else{
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) {
                            res.status(500).json({ success: false, message: `Internal server error: ${err}` })
                        }else{
                            bcrypt.hash(req.body.password, salt, (err, hash) => {
                                if(err) {
                                    res.status(500).json({ success: false, message: `Internal server error: ${err}` })
                                }else{
                                    if(user){
                                        user.password = hash
                                        user.name = req.body.name
                                        user.save().then(() => {
                                            res.status(200).json({ success: true, message: "User created" })
                                        })
                                    }else{
                                        const newUser = new User({
                                            email: req.body.email,
                                            password: hash,
                                            name: req.body.name
                                        })
                                        newUser.save().then(() => {
                                            res.status(200).json({ success: true, message: "User created" })
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }else{
            res.status(400).json({ success: false, message: "Please fill in all fields" })
        }
    },
    loginUser: (req, res) => {
        if(req.body.email && req.body.password) {
            User.findOne({ email: req.body.email }).then((user) => {
                if(!user || user.password==null) {
                    res.status(404).json({ success: false, message: "User not found" })
                }else{
                    user.comparePassword(req.body.password, (err, isMatch) => {
                        if(err) {
                            res.status(500).json({ success: false, message: `Internal server error: ${err}` })
                        }else if(isMatch) {
                            generateToken(user).then(token => {
                                res.status(200).json({ success: true, token: token, message: "User logged in"})
                            })
                        }else{
                            res.status(403).json({ success: false, message: "Invalid credentials" })
                        }
                    })
                }
            })
        }else{
            res.status(400).json({ success: false, message: "Please fill in all fields" })
        }
    }
}