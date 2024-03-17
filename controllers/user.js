const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

//importing models
const User = require('../models/user');

//importing middleware
const { generateToken } = require('../middlewares/auth')

//importing utils
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');


exports.registerUser = catchAsync(async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!email && !phone) {
        throw new AppError("Please Provide a Valid Email Or Phone Number", 400)
    }

    if (phone.toString().length !== 10) {
        throw new AppError("Phone number should be 10 digits", 400)
    }

    if (!password) {
        throw new AppError("Please Provide a Valid Email", 400)
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new AppError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.", 400)
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ firstName, lastName, phone, email, password: hashedPassword, active: true });

    const token = generateToken(user._id)

    const response = {
        _id: user._id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        token: token
    };

    res.status(201).json({ status: 'success', message: 'User Successfully Registered', data: response });
});

exports.loginUser = catchAsync(async (req, res) => {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
        throw new AppError("Please Provide a Valid Email or Phone Number", 400);
    }

    if (!password) {
        throw new AppError("Please Provide a Valid Email", 400)
    }


    let user;
    if (email) {
        user = await User.findOne({ email });
    } else if (phone) {
        user = await User.findOne({ phone });
    }

    if(!user){
        throw new AppError("Please Register", 400);
    }

    const checkUser = await bcrypt.compare(password, user?.password)

    if (!user || !checkUser) {
        return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    const token = generateToken(user._id)

    const response = {
        _id: user._id,
        email: user.email ?? "",
        phone: user.phone ?? "",
        token: token
    }

    res.status(200).json({ status: 'success', data: response });

});

exports.getUserProfile = catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Please Provide a Valid User Id", 400)
    }

    const user = await User.findById(id);

    if (!user) {
        throw new AppError("Unable to Found User", 400)
    }

    let response = {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        token: res.locals.token
    }

    res.status(200).json({ status: 'success', data: response });
});
