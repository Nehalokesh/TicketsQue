const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auction');
const { authenticateUser } = require('../middlewares/auth');

router.post('/createItem', authenticateUser, auctionController.listItemForAuction);

router.post('/placeBid', authenticateUser, auctionController.placeBid);

router.get('/viewItem', authenticateUser, auctionController.viewItemsForAuction);

router.get('/viewWinningBids', authenticateUser, auctionController.viewWinningBids);

module.exports = router;