const jwt = require('jsonwebtoken');
const AuthModel = require('./../models/auth.Model');
const verifyToken = async (req, res, next) => {
    const accessToken = req.headers.token;
    if (accessToken) {
        await jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    error: 1,
                    message: 'Token is invalid',
                    payload: {}
                });
            }
            req.user = user;
            next();
        })
    }
    else {
        return res.status(403).json({
            error: 1,
            message: `You're not authenticated`,
            payload: {}
        })
    }
}
const checkLogin = (req, res, next) => {
    const accessToken = req.headers.token;
    AuthModel.findOne({ accessToken: accessToken })
        .then(isLogin => {
            if (isLogin) {
                return next();
            }
            else {
                return res.status(403).json({
                    error: 1,
                    message: `You're not authenticated`,
                    payload: {}
                })
            }
        }).catch(err => {
            return res.status(500).json({
                error: 1,
                message: `Server Error`,
                payload: {}
            })
        })
}
module.exports = {
    verifyToken,
    checkLogin
}