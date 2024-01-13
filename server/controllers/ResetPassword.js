const User = require('../models/User')
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// resetPasswordToken   -> will handle Password Change Mail Sending
exports.resetPasswordToken = async (req, res) => {
    try {
        // 1. fetch details {email} form req body
        // 2. check user for this email, email Validation
        // 3. generate token
        // 4. update user by adding token and expiration time
        // 5. create url
        // 6. send mail containing the url
        // 7. return response

        // 1.
        const email = req.body.email;

        // 2
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: `Your Email is not Registered with us.`
            })
        }

        // 3
        // const token = crypto.randomUUID();
        const token = crypto.randomBytes(20).toString("hex");

        // 4
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true },
        )
        // 5
        const url = `https://localhost:3000/update-password/${token}`

        // 6
        await mailSender(email, `Password Reset Link`, `Password Reset link : ${url}`);

        // 7
        return res.json({
            success: true,
            message: 'Password Reset Email Sent Successfully. Please Check Email and Change the Password.'
        })

    } catch (error) {
        console.log(`Something occured in attempting to send mail for Resetting Password. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong  while sending Passoword Reset Email. Please try Again!!'
        })
    }
}

// resetPassword       -> will handle the actual password change and updation in the Database
exports.resetPassword = async (req, res) => {
    try {
        // 1.fetch data
        // 2.validation
        // 3.get User details from Database using Token
        // 4.if no Entry -> Invalid Token
        // 5.token time check
        // 6.hash Password
        // 7.Update Password
        // 8.return response

        // 1
        const { password, confirmPassword, token } = req.body;

        // 2
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: `Passoword not Matching`,
            });
        }

        // 3
        const userDetails = await User.findOne({ token: token });

        // 4
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is Invalid'
            })
        }

        //5
        if (userDetails.resetPasswordExpires > Date.now()) {
            return res.json({
                success: false,
                message: `Token is expired!! Plese Regenerste your Token`
            })
        }

        // 6
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        )

        // 8
        return res.status(200).json({
            success: true,
            message: `Password Reset Successfull.`
        })

    } catch (error) {
        console.log(`Something occured in attempting Resetting Password in the Database.`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Resetting Passoword in Database',
        })
    }
}