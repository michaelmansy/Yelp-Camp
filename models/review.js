const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// we want to have manny reviews for one campground so gonna have to require this file there and add an object id for the reviews

// export it using the name of the file and the name of the model
module.exports = mongoose.model('Review', reviewSchema);