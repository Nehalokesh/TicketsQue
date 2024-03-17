const express = require('express');
const router = express();
const authRoute = require('./routes/auth')
const auctionRoute = require('./routes/auction')


router.use('/auth', authRoute)

router.use('/auction', auctionRoute)

module.exports = router;