var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


//define some data for different campgrounds
var data =[
    {
        name: "lola",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "years of eggs"
    },
    {
        name: "soso",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "bed el seniiiin"
    },
    {
        name: "souna",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "les annees des oeufs"
    }
    ]


function seedDB(){
    //first thing---remove everything in our database
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("campgrounds are removed now")
        }
    });
    //add few campgrounds
    // data.forEach(function(seed){
    //   Campground.create(seed, function(err, campground){
    //       if(err){
    //           console.log(err);
    //       } else{
    //           console.log("a new campground is added...");
    //           //add a comment for each campground
    //           Comment.create({
    //               text: "great place....but no wifi",
    //               author: "lola bardo"
    //           }, function(err, comment){
    //               if(err){
    //                   console.log(err);
    //               }else{
    //                   //grab the campground we want and add the comment to it
    //                   //then save
    //                   campground.comments.push(comment);
    //                   campground.save();
    //                   console.log("created a new comment");
    //               }
    //           });
    //   }
    //   });
    // });
}


module.exports = seedDB;    