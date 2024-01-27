const nodemailer = require('nodemailer')

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: `shhiivvaam`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;
    } catch (error) {
        console.log('Something went wrong in mailSender');
        console.log(error.message);
        console.log(error);
        
        // TODO: make this below accessible
        // return res.status(500).json({
            // success: false,
            // message: 'Something Occured in mailSender',
        // })
    }
}

module.exports = mailSender;