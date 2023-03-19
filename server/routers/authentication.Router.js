const express = require('express');
const AuthenController = require('./../controllers/authentication.Controller');
const { verifyToken, checkLogin } = require('./../middlewares/authentication.Middleware');
const router = express.Router();
// Login
router.post('/login', AuthenController.userLogin);
router.post('/logout', checkLogin, verifyToken, AuthenController.userLogout);
router.post('/refresh-token', AuthenController.reqRefreshToken);
module.exports = router;