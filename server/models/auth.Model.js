const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuthSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model('Authentication', AuthSchema);