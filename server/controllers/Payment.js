const { instance } = require('../config/razorpay')
const Course = require('../models/Course')
const CourseProgress = require('../models/CourseProgress')
const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const crypto = require('crypto');
// TODO: import course enrollement Template

const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail')
const { mongoose } = require('mongoose');
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail');

require('dotenv').config();

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    // 1. get CourseId and UserId
    // 2. validation
    // 3. valid courseId
    // 4. valid courseDetail
    // 5. user already pay for the same course
    // 6. order create
    // 7. return response

    // 1
    // TODO : check for this, is this needed or not
    // const { course_id } = req.body;
    try {
        const userId = req.user.id;
        const { courses } = req.body;

        // 2
        // TODO: check that is the below TODO for { course_id } works than this is not needed anymore   
        if (courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide course Id',
            })
        }
        // 3
        // TODO: check for this, is this needed or not with the above import of { course_id }
        // if (!course_id) {
        //     return res.json({
        //         success: false,
        //         message: `Please provide valid Course ID`,
        //     })
        // };

        // 4
        let totalAmount = 0;
        for (const course_id of courses) {
            let course;
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: `Could not find the course`,
                })
            }

            // 5 checking that whether the user is already enrolled in the same course and have already done with the payment -> if so return reponse -> already enrolled
            const uid = new mongoose.Types.ObjectId(userId);               // since the userID is of the form String -> converting it to ObjectId form
            if (course.studentsEntrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: `Student is already Enrolled`,
                })
            }

            // TODO: yaha se krna hai
            totalAmount += course.price;

            // 6
            // const amount = course.price;
            const currency = 'INR';


            const options = {
                amount: totalAmount * 100,        // for converting it in the format ->  { amount.00 } ex : 100.00
                currency,
                receipt: Math.random(Date.now()).toString(),              // optional
                notes: {
                    courseId: course_id,
                    userId,
                }
            }

            try {
                //! initiate the payment using the RazorPay
                const paymentResponse = await instance.orders.create(options);
                console.log(paymentResponse);

                res.status(200).json({
                    success: true,
                    message: paymentResponse,
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    thumbnail: course.thumbnail,
                    orderId: paymentResponse.id,
                    currency: paymentResponse.currency,
                    amount: paymentResponse.amount,
                })

            } catch (error) {
                console.log(`Something occured while initiating the Payment Instance.`, error.message);
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong while initiating for the Payment Instance.'
                })
            }
        }
    } catch (error) {
        console.log(`Something occured while attempting for Payment. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while attempting for Payment. Please try Again!!'
        })
    }
}

// verify Signature of RazorPay and Server  -> Handler Function
exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = process.env.WEBHOOK_SECRET;        //! server side webhookSecret

        const signature = req.headers["x-razorpay-signature"]            //! secret from payment GateWay -> RazorPay

        //! we are trying to convert back the webhookSecret key to a hashed version { using (crypto inbuild library)} to later compare it with the signature provided by the RaozorPay and then initiate the Verification

        //? Hmac -> hashed based message authentication code
        //? SHA -> Secure Hashing Algorithm              // both of these are used for converting a key to a Hashed Version

        //* difference between this { Hmac and SHA } is that the { SHA } only requies the key to be hashed into, but the { Hmac } requires two things ( the first is any kind of Hashing Algorithm and the second is the password kind of thing, that eventually is used to start this secure hashing process): 1. hashing Algorithm   2. SECRET_KEY

        const shasum = crypto.createHmac("sha256", webhookSecret);
        // converting this to String Format
        shasum.update(JSON.stringify(req.body));

        // This { digest } is a term used to store the HexaDeciaml Format of the Obtained Hash Version
        const digest = shasum.digest("hex");

        // checking the hashed version provided by the razorpay in the req.header { signature } with the webhookSecret hashed that we performed above
        if (signature === digest) {
            console.log(`Payment is Authorized`);

            //! Adding the user in the Desired Course and also creating an entry for the course in the User Course enrolled section 
            // since we are using the payment and the bank and razorpay will be only responsible, so we cannot get the { user and Course } Details form the { req.body } and so we are trying to gwet it from the notes { that we sent as the option parameter while creating the instance of the Payement }
            const { courseId, userId } = req.body.payload.payment.entity.notes;

            try {
                // find the course and enroll the student in the course
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    {
                        $push: {
                            studentsEntrolled: userId,
                        }
                    },
                    { new: true },
                );

                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        message: `Course Not Found`,
                    })
                }
                console.log(enrolledCourse);

                // find the student and add the Course to the list of the Enrolled Courses
                const enrolledStudent = await Course.findOneAndUpdate(
                    { _id: userId },
                    {
                        $push: {
                            courses: courseId,
                        }
                    },
                    { new: true },
                )
                console.log(enrolledStudent);

                //! Send the Confirmation Email
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    `Congratualtions! frOm shhiivvaam`,
                    `Congratulations! You have Successfully onboarded into the shhiivvaam Course`,
                );
                console.log(emailResponse);

                return res.status(200).json({
                    success: false,
                    message: `Signature Verified and Course Added to the User {student}`,
                })

            } catch (error) {
                console.log(`Unable to Enroll Student to the Course.`, error.message);
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: `Unable to Enroll Student to th Course and Update the Students/Course Details about Enrollment.`
                })
            }
        } else {
            // When Signature does not Match

            console.log(`Payment Gateway Hashed Version and Secret Key Hashed Version, not Matched!!`);
            return res.status(400).json({
                success: false,
                message: `Payment Gateway Hashed Version and Secret Key Hashed Version, not Matched!!`,
            })
        }

    } catch (error) {
        console.log(`Something occured while attempting Signature Verification. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while attempting Signature Verification. Please try Again!!'
        })
    }
}

// verifyPayement
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // await enrollStudents(courses, userId, res);                   // updating enrolled Students
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        });
    }
    return res.status(200).json({
        success: "false",
        message: "Payment Failed!! Something occured in Razorpay->  Verifying the Payment"
    });
}   

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details"
        })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    } catch (error) {
        console.log("Something Occured in Sending Payment Success Email");
        console.log(error.message);
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Could not send email",
        })
    }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for (const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnroled: userId } },
                { new: true }
            )

            if (!enrolledCourse) {
                console.log('Course not found!!')
                return res.status(500).json({
                    success: false,
                    message: "Course not found!!"
                })
            }
            console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })
            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            )

            console.log("Enrolled student: ", enrolledStudent)
            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )
            console.log("Email sent successfully: ", emailResponse.response);

        } catch (error) {
            console.log('Something Occured in Enrolling Student');
            console.log(error.message)
            console.log(error)
            return res.status(400).json({
                success: false,
                message: 'Something Occured in Enrolling Student',
            })
        }
    }
}