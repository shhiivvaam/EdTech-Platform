const RatingAndReview = require('../models/RatingAndReview')
const Course = require('../models/Course')
const mongoose = require('mongoose')

// create Rating
exports.createRating = async (req, res) => {
    try {
        // 1. get user id
        // 2. fetch data from req body
        // 3. check if the user is enrolled in the Course or not
        // 4. check if user already reviewed the course
        // 5. create rating and review
        // 6. update course with the rating/review
        // 7. return response

        // 1
        const userId = req.body.id;
        
        // 2
        const { rating, review, courseId } = req.body;

        // 3
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEntrolled: {$elemMatch: {$eq: userId}},                      // { $eq }   => equal Operator
            }
        )

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Student is not enrolled in the Course.`
            })
        }

        // 4
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        })
        if(alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: `Course is already reviewed by the User.`
            })
        }

        // 5
        const ratingReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating: rating,
            review: review,
        })

        // TODO: neeche issmai kuch galti hue ha shyd, dhundh!!
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new: true},
        )
        console.log(updatedCourseDetails);

        // 7
        return res.status(200).json({
            success: true,
            message: `Rating and Reviews Created Successfully.`,
            ratingReview,
        })

    } catch (error) {
        console.log(`Something occured while creating a Review. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating a Review. Please try Again!!'
        })
    }
}

// get Average Rating
exports.getAverageRating = async(req, res) => {
    try{
        // 1. get CourseId
        // 2. calculate Average Rating
        // 3. return rating

        // 1
        const courseId = req.body.courseId;

        // 2
        const result = await RatingAndReview.aggregate([
            {
                $match: {                                                  // to find the matching object
                    course: new mongoose.Types.ObjectId(courseId),         // converting the String to Object Form
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ])

        // 3
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message: `Average Rating Reviews Fetched Successfully.`,
                averageRating: result[0].averageRating,
            })
        }

        // if no Rating/review
        return res.status(200).json({
            success: true,
            message: `Average Rating is 0. No Ratings is given till now!!.`,
            averageRating: 0,
        })

    } catch(error) {
        console.log(`Something occured while fetching Average Rating. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching the Average Rating. Please try Again!!'
        })
    }
}

// get All Rating And Reviews
//? This function will return all the Rating, and does not depend on any Specific Course specification, but it just returns all the rating provided to all the courses. In short, it just returns all the course Rating from the Database.
exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                            .sort({rating: "desc"})          // to get the latest reviews first
                            .populate({
                                path: "user",
                                select: "firstName lastName email image",
                            })
                            .populate({
                                path: "course",
                                select: "courseName",
                            })
                            .exec();

        return res.status(200).json({
            success: true,
            message: `All Ratings Reviews Fetched Successfully.`,
            allReviews,
        })

    } catch(error){
        console.log(`Something occured while fetching all the Ratings. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching all the Ratings. Please try Again!!'
        })
    }
}