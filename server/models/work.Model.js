const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workSchema = new Schema({
    workName: {
        type: String,
        required: true,
        searchable: true
    },
    workStatus: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Work', workSchema);