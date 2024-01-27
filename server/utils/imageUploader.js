const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async(file, folder, height, quality) => {
    try{

        const options = {folder};
        if(height){
            options.height = height;        // height and quality is used to image compression
        }
        if(quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";        // it auto fetch image type;

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch(error) {
        console.log('Something occured while uploading Image to Cloudinary');
        console.log(error.message);
        console.log(error);
        // return res.status(500).json({
        //     success: false,
        //     message: 'Something occured while uploading Image to Cloudinary',
        // })
    }
}