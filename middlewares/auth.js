const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Generate a JWT token
const generateToken = (userId) => {
    const token = jwt.sign({ userId: userId, }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRATION_TIME });
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

const authenticateUser = catchAsync(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        throw new AppError('No token provided', 401);
    }
    if (token) {
        token = token.replace(/^Bearer\s+/, "");
    }
    const userId = verifyToken(token);

    if (!userId) {
        throw new AppError('Unauthorized', 401);
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError('User not found', 404);
    }


    const generatedToken = generateToken(user.id)

    res.locals.token = generatedToken;
    req.body.loggedInUserId = user._id
    next();
})


module.exports = { generateToken, authenticateUser, verifyToken };
