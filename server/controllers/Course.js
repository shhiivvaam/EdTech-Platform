const Course = require('../models/Course');
const Category = require('../models/Category')
const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress')

const { uploadImageToCloudinary } = require('../utils/imageUploader')
const { convertSecondsToDuration } = require('../utils/secToDuration')

require("dotenv").config();


// Course Creation Handler Function
exports.createCourse = async (req, res) => {
    try {

        // fetch all the data
        const userId = req.user.id;
        const { courseName, courseDescription, whatYouWillLearn, price, tag: _tag, category, status, instructions: _instructions } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !thumbnail || !category || !instructions.length) {
            return res.status(400).json({
                success: false,
                message: `All fields are Required!!`
            })
        }
        if (!status || status === undefined) {
            status = "Draft"
        }

        // check is the user is an instructor
        const instructorDetails = await User.findById(userId, { accountType: "Instructor" });
        console.log(`Instructor Details: `, instructorDetails);
        // TODO: verify that userId and instructorDetails._id are same or Different?

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: `Instructor Details not found`,
            });
        }

        // check whether the category is valid or not    { although the categories will be given from the dropdown menu in the frontEnd but then also performing an extra validation }
        const categoryDetails = await Category.findById(category);            // since in the Course model we have passed the { Course -> Category } as the referece Tag(i.e, it is an objectId) -> so eventually all the Course Tags(refering to this particular tags) will be present here only
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: `Category Details not Found`,
            })
        }

        // Upload Image to Clouidinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an Entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        })

        // add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        // TODO: update the Tag wala Schema with the new Course
        // add the new course to the Tag Schema
        //! problem here that the Course Schema created is having the Course as asn Single Entry but rather is should be an array and then only we will only be able to push the course directly to the Tag Schema 
        // await Tag.findByIdAndUpdate(
        //     {_id: tagDetails._id},
        //     {
        //         $push: {
        //             courses: newCourse._id,
        //         }
        //     },
        //     {new: true},
        // )

        const categoryDetails2 = await Category.findByIdAndUpdate(
            {
                _id: category
            },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: `Course Created Successfully`,
            data: newCourse,
        })

    } catch (error) {
        console.log(`Something occured in Creating a Course. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Creating a Course. Please try Again!!'
        })
    }
}

// getAllCourses Handler Function
exports.getAllCourses = async (req, res) => {
    try {
        // const allCourses = await Course.find({})
        //     .populate("instructor")
        //     .exec();

        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEntrolled: true,
            }
        )
            .populate("instructor")
            .exec();

        return res.json(200).json({
            success: true,
            message: `Data for All Courses Displayed Successfully.`,
            data: allCourses,
        })

    } catch (error) {
        console.log(`Something occured while Showing all the Courses. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Showing all the Courses. Please try Again!!'
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {

        // get id
        const { courseId } = req.body;

        // find Course Details
        const courseDetails = await Course.findOne(
            { _id: courseId },
        )
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                        select: "videoUrl"
                    }
                }
            )
            .exec();

        if (!courseDetails) {
            return res.status(400).json(
                {
                    success: false,
                    message: `Could not find the Course with ${courseId}`,
                }
            )
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                // totalDurationInSeconds += subSection.duration;
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        // return response
        return res.status(200).json(
            {
                success: true,
                message: `Course detials fetched Successfully.`,
                data: { courseDetails, totalDuration },
            }
        )

    } catch (error) {
        console.log(`Something occured while Showing the Details of a Course. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while Showing Details of a Course. Please try Again!!'
        })
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            console.log('Unable to get the course!!')
            return res.status(404).json({
                success: false,
                message: 'Unable to edit the Course, Editable Course does not found!!',
            })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            console.log("Thumbnail Update")
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key];
                }
            }
        }
        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })

    } catch (error) {
        console.log('Something Occured while Editing the Course');
        console.log(error.message);
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something Occured while Updating the Course",
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        })
    } catch (error) {
        console.log('Unable to fetch all Course Details');
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch all Course Details',
        })
    }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.log('Unable to get Instructor Course Details')
        console.error(error.message)
        console.error(error)
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve instructor courses",
        })
    }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnroled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId,
                {
                    $pull: {
                        courses: courseId
                    },
                })
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.log('Something occurred while deleting the Course')
        console.error(error.message);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something occurred while deleting the Course",
            error: error.message,
        })
    }
}