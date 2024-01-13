const express = require('express');
const app = express();

// Routes
const userRoutes = require('./routes/User');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');
const profileRoutes = require('./routes/Profile');
const contactUsRoute = require("./routes/Contact");

// MONGO DB
const database = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// CLOUDINARY
const { cloudinaryConnect } = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4000;

// Database Connect
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }
))
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)

// Cloudinary Connect
cloudinaryConnect();

// routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);


// default Route
app.get('/', (req, res) => {
    return res.json({
        success: true, 
        message: `We are now Connected!!   StudyNotion`,
    })
})

app.listen(PORT, () => {
    console.log(`Application is running Successfully on: ${PORT}`);
})

