const Profile = require('../models/Profile')
const User = require('../models/User')
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');

const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

const mongoose = require('mongoose');

//! Remember we need not to add the Profile Create Handler Function because, it will already be created when user enters and also, it not then there will be a { null } entry that we will need to update and so continuing with the update Handler Function

// TODO: find out how to schedule a request
//? ex: like if we have to delete a particular account after some specific time, so how we will schedule it in such a way that, that particular req will execute after waiting for that many time 

// Handler function to Update Profile
exports.updateProfile = async (req, res) => {
    try {
        // 1. get data
        // 2. get userId
        // 3. validation
        // 4. find Profile
        // 5. update Profile
        // 6. return response

        // 1
        const { firstName = "", lastName = "", dateOfBirth = "", about = "", contactNumber = "", gender = "" } = req.body;

        // 2
        const id = req.user.id;

        // 3
        // if(!about || !contactNumber || !id) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `All fields are required. Please fill all the details Carefully!!`,
        //     })
        // }

        // 4
        //* User Schema mai additionalDetails mao Profile ka { ref } pass kia hua ha
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);
        const user = await User.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName });
        await user.save();

        // 5
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;

        await profile.save();
        //* quki hamare pass yaha par direct entry bani hue ha, aaur hamare pass { profile } ka object create hua hua ha, isslia directly { save } kr dia DataBase mai, no need to { create } an Entry

        // Find the updated User details
        const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec();

        // 6
        return res.status(200).json({
            success: true,
            message: `Profile Updated Successfully.`,
            updatedUserDetails,
        })

    } catch (error) {
        console.log(`Unable to update a Profile. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to update a Profile. Please try Again!!`
        })
    }
}

// Handler Function to Delete Profile
exports.deleteAccount = async (req, res) => {
    try {
        // 1. get id
        // 2. validatiom
        // 3. delete Profile
        // 4. delete User
        // 5. return response

        // 1
        const id = req.user.id;

        // 2
        // const userDetails = await User.findById(id);
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not Found!!`,
            })
        }

        // 3
        // await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        // TODO : change to the below command and comment out upper, after testing for the API
        await Profile.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(user.additionalDetails) });

        // TODO: Delete the User Profile from all the Courses he/she is enrolled in and also decrease the count of studentsEntrolled in Courses. 
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
                courseId,
                {
                    $pull: {
                        studentsEntrolled: id
                    }
                },
                { new: true },
            )
        }

        // 4
        await User.findByIdAndDelete({ _id: id });
        await CourseProgress.deleteMany({ userId: id })

        // 5
        return res.status(200).json({
            success: true,
            message: `Profile and User Deleted Successfully.`
        })

    } catch (error) {
        console.log(`Unable to Delete Profile. Please Try Again!!`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to Delete Profile. Please try Again!!`
        })
    }
}

// Handler function to get All the Details of a User
// this function returns all the account Details of a particular user at a time
exports.getAllUserDetails = async (req, res) => {
    try {
        // get id
        // validation and get user Details
        // return response

        // 1
        const id = req.user.id;

        // 2
        //? because hamare pass user details hai, lekin profile nhi toh sari details show krne k lia -> particular user ki { id } ko Profile { reference } se populate kr dia, so that all the details(with the Profile details as well) will be shown in the repsonse
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // 3
        return res.status(200).json({
            success: true,
            message: `User Data Fetched Successfully`,
            data: userDetails,
        })

    } catch (error) {
        console.log(`Something occurred in fetching User Data!!`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to Fetch User Data. Please try Again!!`
        })
    }
}

// update User Display Picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000)

        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    }
    catch (error) {
        console.log('Something occured in Updating User Display Picture');
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something occurred in Updating User Display Picture',
        })
    }
}

// get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({ _id: userId, })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec()

        userDetails = userDetails.toObject();
        var SubsectionLength = 0;

        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({ courseID: userDetails.courses[i]._id, userId: userId, })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            }
            else {                                             // To make it up to 2 decimal point 
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    }
    catch (error) {
        console.log('Something occurred in Fetching the Enrolled Courses');
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something occurred in Fetching the Enrolled Courses',
        })
    }
}

// Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course?.studentsEnrolled?.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,                               // Include other course properties as needed
                totalAmountGenerated,
            }
            return courseDataWithStats
        })

        res.status(200).json({
            courses: courseData,
        })
        
    } catch (error) {
        console.log('Something occured in the Intructor Dashboard details fetching!!')
        console.error(error.message);
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something occured in the Intructor Dashboard details fetching!!",
        })
    }
}