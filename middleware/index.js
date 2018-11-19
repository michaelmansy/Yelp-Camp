var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
          if (err){
                res.redirect("back");
          }else{
                //does he own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                // otherwise, redirect somewhere     
                }else{
                    req.flash("error", "you dont have permission...");
                    res.redirect("back");
                     }
                }
        });
    } else{
        req.flash("error", "you need to be logged in to do that");    
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "please login first");  //this line yet dont display anything; add it to login code in the other index.js
    res.redirect("/login");
}



module.exports = middlewareObj;