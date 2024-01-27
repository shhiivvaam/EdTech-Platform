const mongoose = require('mongoose')
require("dotenv").config()

const colors = require('colors');

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL , {
        useNewUrlParser: true,  //new u rl parser
        useUnifiedTopology: true,  //use mongo db
    })
    .then(() => { console.log('Database Connected Successfully'.bgBlue) })
    .catch((error) => {
        console.log('Database Connection Failed!!'.bgRed)
        console.log(error.message);
        console.log(error);
        process.exit(1);
    })
}