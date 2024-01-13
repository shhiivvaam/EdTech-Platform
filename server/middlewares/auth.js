const jwt = require('jsonwebtoken')
require("dotenv").config();
const User = require('../models/User')

// auth
exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");

        // if token missing, the return false response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: `Auth Cookie Token is Missing`
            });
        }

        // verify the token
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch(error) {
            return res.status(401).json({
                success: false,
                message: 'Token is Invalid!!',
            });
        }

        next();

    } catch (error) {
        console.log(`Something occured in MiddleWare - Auth` , error.message);
        console.log(error);
        return res.status(401).json({
            success: false,
            message: `Something went wrong while Validation Token`,
        })
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: `This is a Protected Route for Students Only`,
            })
        }

    } catch(error) {
        console.log(`Something occured in MiddleWare - isStudnet` , error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `User role cannot be Verified. Please Try Again!!`,
        })
    }
}


// isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: `This is a Protected Route for Instructor Only`,
            })
        }

    } catch(error) {
        console.log(`Something occured in MiddleWare - isInstructor` , error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `User role cannot be Verified. Please Try Again!!`,
        })
    }
}


// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        console.log("Check Account Type: ", req.user.accountType);
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: `This is a Protected Route for Admin Only`,
            })
        }

    } catch(error) {
        console.log(`Something occured in MiddleWare - isAdmin` , error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `User role cannot be Verified. Please Try Again!!`,
        })
    }
}