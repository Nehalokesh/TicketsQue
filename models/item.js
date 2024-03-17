const mongoose = require('mongoose');
require('./user')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    startingPrice: {
        type: Number,
    },
    auctionStartTime: {
        type: Date,
        default: Date.now
    },
    auctionEndTime: {
        type: Date,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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


module.exports = mongoose.model('Item', itemSchema)
