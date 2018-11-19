// the campground schema

var mongoose = require("mongoose");

// schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  // we want to associate every campground created to its user who is loggedin 
  author: {
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String
  },
  //Adding an object id to reference the comments array 
  //so that we now have an association between campgrounds and omments
  comments: [
      {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
      }
  ]
});

// compile it into a model
module.exports= mongoose.model("Campground", campgroundSchema);
