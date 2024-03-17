const moment = require('moment');
const mongoose = require('mongoose')

//importing models
const Item = require('../models/item');
const Bid = require('../models/bid');

//importing utils
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');

exports.listItemForAuction = catchAsync(async (req, res) => {
    const { name, description, startingPrice, auctionStartTime, auctionEndTime, loggedInUserId } = req.body;

    if (!name) {
        throw new AppError("Please Provide a Valid Name", 400);
    }


    if (!description) {
        throw new AppError("Please Provide a Valid Description", 400);
    }

    if (isNaN(startingPrice) || startingPrice <= 0) {
        throw new AppError("Please provide a valid positive number for startingPrice", 400);
    }

    if (!auctionStartTime) {
        throw new AppError("Please Provide a Valid auctionStartTime", 400);
    }

    if (!auctionEndTime) {
        throw new AppError("Please Provide a Valid auctionEndTime", 400);
    }

    const newItem = await Item.create({
        name,
        description,
        startingPrice,
        auctionStartTime: moment(auctionStartTime).toDate(),
        auctionEndTime: moment(auctionEndTime).toDate(),
        seller: loggedInUserId,
        createdBy: loggedInUserId,
        active: true
    });


    res.status(201).json({ status: 'success', message: 'Item listed for auction successfully', data: newItem, token: res.locals.token });
});

exports.placeBid = catchAsync(async (req, res) => {
    const { itemId, amount, loggedInUserId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new AppError("Please Provide a Valid itemId", 400);
    }

    if (isNaN(amount) || amount <= 0) {
        throw new AppError("Please provide a valid positive number for amount", 400);
    }

    const item = await Item.findById(itemId).lean();

    if (!item) {
        throw new AppError("Item not found", 404);
    }

    if (moment().isAfter(item.auctionEndTime)) {
        throw new AppError("Bidding for this item has ended", 400);
    }

    const currentHighestBid = await Bid.findOne({ itemId: itemId }).sort({ amount: -1 }).lean();

    if (currentHighestBid && amount <= currentHighestBid.amount) {
        throw new AppError("Your bid amount should be higher than the current highest bid", 400);
    }

    const newBid = await Bid.create({
        bidder: loggedInUserId,
        itemId: itemId,
        bidDate: Date.now(),
        createdBy: loggedInUserId,
        active: true,
        amount: amount
    });

    res.status(201).json({ status: 'success', message: 'Bid placed successfully', data: newBid, token: res.locals.token });
});

exports.viewItemsForAuction = catchAsync(async (req, res) => {

    const items = await Item.find({ auctionEndTime: { $gt: new Date() } })
        .populate('seller', 'firstName lastName email')
        .lean();

    if (items.length === 0) {
        throw new AppError("No items available for auction", 404);
    }

    res.status(200).json({ status: 'success', data: items, token: res.locals.token });
});

exports.viewWinningBids = catchAsync(async (req, res) => {
    const winningBids = await Bid.aggregate([
        {
            $group: {
                _id: "$itemId",
                maxAmount: { $max: "$amount" },
                winningBid: { $first: "$$ROOT" }
            }
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "_id",
                as: "item"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "winningBid.bidder",
                foreignField: "_id",
                as: "bidderDetails"
            }
        },
        {
            $unwind: "$item"
        },
        {
            $project: {
                _id: "$item._id",
                name: "$item.name",
                description: "$item.description",
                winningBid: "$maxAmount",
                bidder: {
                    _id: "$bidderDetails._id",
                    firstName: { $arrayElemAt: ["$bidderDetails.firstName", 0] },
                    lastName: { $arrayElemAt: ["$bidderDetails.lastName", 0] }
                }
            }
        }
    ]);

    if (winningBids.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'No winning bids found' });
    }

    for (const bid of winningBids) {
        const bidder = bid.bidder
        if (bidder) {
            bid.bidderId = bidder._id[0];
            bid.bidderName = `${bidder.firstName} ${bidder.lastName}`;
        }
        delete bid.bidder;
    }

    res.status(200).json({ status: 'success', data: winningBids, token: res.locals.token });
});


