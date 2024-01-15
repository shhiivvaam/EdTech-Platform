const User = require('../models/User')
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')
const { passwordUpdated } = require('../mail/templates/passwordUpdate')
require('dotenv').config();

const mailSender = require('../utils/mailSender')

const Profile = require('../models/Profile')

// Auth Controller

// sendOTP
exports.sendOTP = async (req, res) => {

    try {
        // fetch user from req body
        const { email } = req.body;

        // check weather the user already present
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User is already Registered!!'
            })
        }

        //* generator OTP     -> length 6 and with some contraints(to cotains only numbers)
        var otp = await otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log('OTP Generated: ', otp);


        // check unique OTP or not
        let result = await OTP.findOne({ otp: otp });
        // while unable to find unique OTP, continue generation
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }

        //? create and entry in Database for OTP
        // const otpPayload = {email, otp};
        // const otpBody = await OTP.create(otpPayload);
        const otpBody = await OTP.create({ email, otp });
        console.log("otpBody", otpBody);

        // return successfull response
        return res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp
        })

    } catch (error) {
        console.log('Some error in Auth - OTP');
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'OTP Generation Failed!!!'
        })
    }
}

// signUP
exports.signUp = async (req, res) => {
    // 1. data fetch from re body
    // 2. Validate fetched Data
    // 3. Match both the { 2 } passsword
    // 4. check if the user already exists

    // 5. find the most recent OTP stored in the user Datbase
    // 6. Validate OTP

    // 7. Hash Password
    // 8. Create entry for the Database

    // 9. return a successfull response

    try {
        // 1
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // 2
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: `Please fill all the details!!!`
            })
        }

        // 3
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: `Password and Confirm Password are not matching. Please try Again!!`
            })
        }

        // 4
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User is already Registered!!`
            })
        }

        // 5
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // 6
        if (recentOtp.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: `OTP not Found!!`
            });
        } else if (recentOtp[0].otp !== otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try Again!!'
            });
        }

        // 7
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        // 8
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // 9
        return res.status(200).json({
            success: true,
            message: `User is Registered Successfully`,
            user,
        })

    } catch (error) {
        console.log(`Something occured in attempting to Signing Up User`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `User cannot be Registered. Please try Again!!`
        })
    }
}

// LogIn
exports.login = async (req, res) => {
    try {
        // 1. get data from req body
        // 2. validation of data
        // 3. check user exists or not
        // 4. generate JWT token, after password matching,
        // 5. create cookie and send response

        // 1
        const { email, password } = req.body;

        // 2
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: `All fields are required!! Please fill all the Details.`
            })
        }

        // 3
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered. Please SignUp!!`
            })
        }

        // 4
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            })

            // Save token to user document in Database
            user.token = token;
            user.password = undefined;

            // 5
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),   // expires in 3 days
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `Logged in Successfully.`
            })

        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect!!`
            })
        }

    } catch (error) {
        console.log(`Something occured in attempting to Login. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failed. Please try Again!!'
        })
    }
}   

// changePassword
exports.changePassword = async (req, res) => {
    try {
        //  1. fetch data from req body
        //  2. get oldPassword, newPassword and confirmNewPassword
        //  3. Password validation

        //  4. update password in Database
        //  5. Send mail - Password Updated
        //  6. return response


        // Get user data from req.user
        const userDetails = await User.findById(req.user.id)

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmPassword } = req.body

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" })
        }

        // mactching the newpassword and the confirmPassword
        if(newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'This entered new Password and Confirm Password does not match!!'
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )

        // Send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

        // Return success response
        return res.status(200).json({ 
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error.message)
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
}

