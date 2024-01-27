const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')
const { otpTemplate } = require('../mail/templates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
})

// pre middlewares
//? for sending the verification email after requesting for the otp and before { pre middlewares } the details are submitted in the Database.]
//? it is basically for the verification of the user's email, that is we will send the email verification link and if it comes true, then only we will register the user in the database
async function sendVerificationEmail(email, otp) {
    try {
        const title = `Verification Email from shhiivaam`;
        const mailResponse = await mailSender(email, title, otpTemplate(otp));
        console.log('Email Sent Successfully', mailResponse);

    } catch (error) {
        console.log(`Something occuered in sending Verification Email in OTP`);
        console.log(error.message);
        console.log(error);
    }
}

OTPSchema.pre('save', async function (next) { 
    // here pre-save means that OTP is sended before saving to OTP Schema
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }

    next();
})

module.exports = mongoose.model("OTP", OTPSchema);