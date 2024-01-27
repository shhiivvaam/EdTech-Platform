const SubSection = require('../models/SubSection');
const Section = require('../models/Section');

const { uploadImageToCloudinary } = require('../utils/imageUploader');

// create SubSection handler Function
exports.createSubSection = async (req, res) => {
    try {

        // 1. fetch data from req body
        // 2. extract file/video
        // 3. validation
        // 4. upload video to cloudinary    -> from the secure_url 
        // 5. create a subSection
        // 6. update section with this subsection ObjectId
        // 7. return response

        // 1
        // TODO : check if the timeDuration field is a valid one
        const { sectionId, title, description } = req.body;
        // const { sectionId, title, timeDuration , description } = req.body;

        // 2
        const video = req.files.videoFile;

        // 3
        // TODO : check if the timeDuration field is a valid one
        if (!sectionId || !title || !description || !video) {
        // if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: `All fields are Required!!`
            })
        }

        // 4
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // 5
        const subSectionDetails = await SubSection.create({
            title: title,
            // timeDuration: timeDuration,
            // TODO: check for this timeDuration field
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        // 6
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true },
        )
            .populate("subSection")

        // TODO: log updated Section here, after adding populate query

        // 7
        return res.status(200).json({
            success: true,
            message: `SubSection Created Successfully`,
            data: updatedSection,
        })


    } catch (error) {
        console.log(`Unable to create a SubSection. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to Create a SubSection. Please try Again!!`
        })
    }
}

// TODO: update SubSection Handler Function

// TODO: delete SubSection Handler Function

// update Subsetion Handler Function
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")
        console.log("updated section", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.log('An error occurred while updating the section');
        console.error(error.message);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}

// delete SubSection Handler Function
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.log("An error occurred while deleting the SubSection");
        console.error(error.message);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        })
    }
}