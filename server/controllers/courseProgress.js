// const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
// const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => { 
  
  try {          
    // Check if the subsection is valid
    const { courseId, subsectionId } = req.body
    const userId = req.user.id

    const subsection = await SubSection.findById(subsectionId)
    
    if (!subsection) {
      console.log('Something occured in finding Subsection in updated Course Progress');
      // console.log(error.message);
      // console.log(error);
      return res.status(404).json({
        success: false,
        error: "Invalid subsection"
      })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({ courseID: courseId, userId: userId, })

    if (!courseProgress) {
      console.log('Something occured in finding courseProgress in updated Course Progress');
      // console.log(error.message);
      // console.log(error);                                              // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    }
    else {                                                                 // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }
      courseProgress.completedVideos.push(subsectionId)                    // Push the subsection into the completedVideos array
    }

    await courseProgress.save()                                           // Save the updated course progress

    return res.status(200).json({
      success: true,
      message: "Course progress updated" 
    })
  }
  catch (error) {
    console.log('Something occured in Updated Course Progress');
    console.log(error.message);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something occured in Updated Course Progress" 
    })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }