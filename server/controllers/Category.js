const Category = require('../models/Category');

// helper function to get some Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() *max);
}


// Tag Creation ka handler function
// TODO: handle this function, when Creating a Category with the Admin Account, the API goes into a non ending { Sending Request } zone
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: `All fields are Required!!`,
            })
        }

        // create entry in Database
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);

        // return response
        return res.status(201).json({
            success: true,
            message: `Category created Successfully.`,
        })

    } catch (error) {
        console.log(`Something occured in Creating the Tag. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating a Tag. Please try Again!!'
        });
    }
};

// getAllTags Handler Function
// TODO: unable to show all th Cateogries -> their might be some problem with the Course -> Category Route
exports.showAllCategory = async (req, res) => {
    try {
        // filtering tags not on the basis of any criteria, but just returning tags that must have its name and description present
        const allCategory = await Category.find({}, { name: true, description: true });
        // const allCategory = await Category.find({});

        res.status(200).json({
            success: true,
            message: `All tags returned Successfully.`,
            data: allCategory,
        })

    } catch (error) {
        console.log(`Something occured in displaying all created Tags. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while displaying all Tags. Please try Again!!'
        })
    }
}

// category Page Details Handler Function
exports.categoryPageDetails = async (req, res) => {
    try {
        // get CategoryId
        // get Course for Specific CategoryID
        // validation
        // get Course for different Categories
        // get top selling Courses
        // return response



        const { categoryId } = req.body;

        // Get Course for the specific Category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status : "Published"},
                populate: "ratingAndReviews",
                // populate: {
                //     path: "ratingAndReviews",
                // }
            })
            .exec();

        console.log(selectedCategory);

        // Handle the case when the Category is not found
        if (!selectedCategory) {
            console.log("Category not Found.");
            return res.status(404).json({
                success: false,
                message: 'Category Not Found.',
            })
        }

        // Handle the Case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log('No courses found for the selected Category.');

            return res.status(404).json({
                success: false,
                message: `No courses found for the Selected Category`,
            })
        }

        const selectedCourses = selectedCategory.courses;

        // Get Courses for other Categories
        const categoriesExpectSelected = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate("courses")
            .exec();

        // let differentCourses = [];
        // for (const category of categoriesExpectSelected) {
        //     differentCourses.push(...category.courses);
        // }

        // TODO: check this
        let differentCategory = await Category.findOne(categoriesExpectSelected[getRandomInt(categoriesExpectSelected.length)]._id)
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec();

        // Get top-selling courses across all cateogries
        const allCategories = await Category.find().populate({
            path: "courses",
            match: { status : "Published" },
            populate: {
                path: "instructor",
            }
        })

        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        // res.status(200).json({
        //     selectedCourses: selectedCourses,
        //     differentCourses: differentCourses,
        //     mostSellingCourses: mostSellingCourses,
        // });
        res.status(200).json({
            success: true,
            data: {
                    selectedCategory, 
                    differentCategory, 
                    mostSellingCourses,
                }
        })

    } catch (error) {
        console.log(`Something occured in displaying Category Page Details. Please Try Again!!`, error.message);
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while displaying Category Page Details. Please try Again!!'
        })
    }
}