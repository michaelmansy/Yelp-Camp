var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    // author: String   instead of this we r going to define the author as an object which consists of an id (another object) and the username so that we automatically get the name of the username who is already logged in instead of typing it manually
    author: {
       id:{
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   }
});

module.exports = mongoose.model("Comment", commentSchema);