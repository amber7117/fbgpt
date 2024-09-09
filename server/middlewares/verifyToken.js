const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
    verifyToken: (req, res, next) => {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, process.env.SECRET, (err, authData) => {
                if (err) {
                    console.log(err);
                    res.status(405).json({
                        success: false,
                        msg: "Invalid Signature",
                    });
                } else {
                    User.findById(authData.user.id).then((user) => {
                        if (user) {
                            req.user = user;
                            next();
                        }
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                msg: "No Access Token Provided",
            });
        }
    },
};