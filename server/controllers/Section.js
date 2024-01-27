const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const Course = require('../models/Course')

// creating a Section
exports.createSection = async (req, res) => {
    try {

        // 1. fetching details
        // 2. data Validation
        // 3. create Section
        // 4. update Course with Section ObjectID
        // 5. return response

        // 1
        const { sectionName, courseId } = req.body;

        // 2
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties -> All fields are Required!!`,
            });
        }

        // 3
        const newSection = await Section.create({ sectionName });

        // 4
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true },
        )
        .populate(
            {
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }
        ).exec();
        // TODO: use Populate to replace Sections and SubSections both in the UpdatedCourseDetails

        // 5
        return res.status(200).json({
            success: true,
            message: `Section Created Successfully`,
            updatedCourseDetails,
        })

    } catch (error) {
        console.log(`Unable to Create a Section. Please Try Again!!`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to create a Course Section. Please try Again!!`
        })
    }
}

// update Section Handler Function 
exports.updateSection = async (req, res) => {
    try {

        // 1. data input
        // 2. data validation
        // 3 .update data           -> we need not to update the details in the Course since, in the Course we have the Section Id, and since we are updating a Section, and so its ID is already present in the Course
        // 4. return response

        // 1
        const { sectionName, sectionId, courseId } = req.body;

        // 2
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: `Missing Properties -> All fields are Required!!`,
            });
        }

        // 3
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true },
        );

        const course = await Course.findById(courseId)
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                }
            )
            .exec();


        // 4
        return res.status(200).json({
            success: true,
            data: course,
            message: `Section Updated Successfully`,
        })

    } catch (error) {
        console.log(`Unable to Update a Section. Please Try Again!!`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to Update a Course Section. Please try Again!!`
        })
    }
}

// Delete Section
exports.deleteSection = async (req, res) => {
    try {

        // 1. get Id    -> assuming that the Id is sent through the params
        // 2. use findByIdAndDelete
        // 3. return reponse

        // 1
        
        // TODO : assuming that the seciton Id will be present with the response of the frontend -> If not make it with the { req.params }
        // const {sectionId} = req.params;
        const { sectionId, courseId } = req.body;
        // const { courseId } = req.body;

        // 2
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    courseContent: sectionId
                }
            }
        )

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not Found!!',
            })
        }
        // TODO: do we need to delete the entry from the course Schema ??   -> test it while API Testing

        // Delete SubSection
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
        const course = await Course.findById(courseId)
            .populate(
                {                               //here there is no use of const course , its only store updated course;
                    path: "courseContent",                                                               // if you also write without  "const course = " then it also work;
                    populate: {
                        path: "subSection"
                    }
                }
            )
            .exec();


        // 3
        return res.status(200).json({
            success: true,
            data: course,
            message: `Section Deleted Successfully`,
        })

    } catch (error) {
        console.log(`Unable to Delete the Section. Please Try Again!!`);
        console.log(error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to Delete Course Section. Please try Again!!`
        })
    }
}