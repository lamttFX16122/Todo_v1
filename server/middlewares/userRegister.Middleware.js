const UserModel = require('./../models/user.Model');

// check Email exist
const checkEmailRegister = (req, res, next) => {
    const { email } = req.body;

    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                next(); // Not exist
            }
            else {
                return res.status(401).json({
                    error: 2,
                    message: 'Email is Exist',
                    payload: {}
                }) //Exist
            }
        })
        .catch(err => console.log(err));
}
module.exports = {
    checkEmailRegister
}