const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    // we r gonna add the author for each campground so we need to reference to the users
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //  we want to have manny reviews for one campground so gonna have add an object id for the reviews and reference to the review model
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

})


//this middleware to make sure all reviews that belong to one campground are deleted from the database when a campground is deleted
// coming from mongoose docs
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


// export it using the name of the file and the name of the model
module.exports = mongoose.model('Campground', CampgroundSchema);