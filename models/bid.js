const mongoose = require('mongoose');
require('./user')
require('./item')

const bidSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bidDate: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean
    }
}, {
    timeStamps: true
});

module.exports = mongoose.model('Bid',bidSchema);
