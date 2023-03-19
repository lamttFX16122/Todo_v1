const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user.Model');
const AuthModel = require('./../models/auth.Model');
const authController = {
    // Create JWT
    generateAccessToken: (user) => {
        const { _id, email, userName } = user;
        const key = process.env.JWT_SECRET;
        // payload~data=>key=>time
        return jwt.sign({ _id: _id.toString(), email, userName }, key, { expiresIn: '10s' }); // ~30 day
    },
    // Refresh Token
    generateRefreshToken: (user) => {
        const { _id, email, userName } = user;
        const key = process.env.JWT_REFRESH;
        return jwt.sign({ _id: _id.toString(), email, userName }, key, { expiresIn: '60d' }); // refresh token ~ 60 day
    },
    // Login
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return res.status(401).json({
                    error: 1,
                    message: 'Email wrong',
                    payload: {}
                });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    error: 1,
                    message: 'Password wrong',
                    payload: {}
                });
            }
            if (user && validPassword) {
                const { password, ...info } = user._doc; // exclude password
                // Generate access Token
                const accessToken = await authController.generateAccessToken(info);
                const refreshToken = await authController.generateRefreshToken(info);

                const auth = new AuthModel({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: info._id
                })
                auth.save(err => {
                    if (err) {
                        console.log(err);
                    }
                    // Set Cookie
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: false,
                        secure: false,
                        path: '/',
                    });

                    return res.status(201).json({
                        error: 0,
                        message: 'Logged in successfully',
                        payload: {
                            user: info,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    })
                })
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server Error',
                payload: {}
            })
        }
    },
    // Logout
    userLogout: async (req, res) => {
        try {
            await AuthModel.deleteOne({ accessToken: req.headers.token });
            res.clearCookie('refreshToken');
            return res.status(201).json({
                error: 0,
                message: 'logged ot successfully',
                payload: {}
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 1,
                message: 'Server Error',
                payload: {}
            });
        }
    },
    reqRefreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    error: 1,
                    message: `You're not authenticated`,
                    payload: {}
                });
            }

            let auth = await AuthModel.findOne({ refreshToken: refreshToken });
            if (!auth) {
                return res.status(401).json({
                    error: 1,
                    message: `Refresh Token invalid`,
                    payload: {}
                });
            }
            await jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        error: 1,
                        message: 'refresh Token invalid',
                        payload: {}
                    });
                }
                const newAccessToken = authController.generateAccessToken(decoded);
                auth.accessToken = newAccessToken;
                auth.save((err, doc) => {
                    if (err) {
                        return res.status(500).json({
                            error: 1,
                            message: 'Server Error',
                            payload: {}
                        });
                    }
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: false,
                    secure: false,
                    path: '/'
                });
                return res.status(200).json({
                    error: 0,
                    message: 'Refresh Token successfully',
                    payload: {
                        accessToken: newAccessToken
                    }
                })
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server Error',
                payload: {}
            });
        }
    }
}
module.exports = authController;