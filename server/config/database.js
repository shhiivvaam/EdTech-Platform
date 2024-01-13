const mongoose = require('mongoose')
require("dotenv").config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL , {
        useNewUrlParser: true,  //new u rl parser
        useUnifiedTopology: true,  //use mongo db
    })
    .then(() => { console.log('Database Connected Successfully') })
    .catch((error) => {
        console.log('Database Connection Failed!!')
        console.log(error.message);
        console.log(error);
        process.exit(1);
    })
}