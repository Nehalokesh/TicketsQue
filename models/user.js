const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    active: {
        type: Boolean
    }
}, {
    timeStamps: true
});

module.exports = mongoose.model('User',userSchema)
