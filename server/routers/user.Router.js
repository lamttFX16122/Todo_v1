const express = require('express');
const UserController = require('./../controllers/user.Controller');
const { checkEmailRegister } = require('./../middlewares/userRegister.Middleware');
const router = express.Router();
router.post('/register', checkEmailRegister, UserController.userRegister);
module.exports = router;