const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Express.Error.js");
const Review = require("../models/review.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isReview,isOwner} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


//POST ROUTE
router.post("/",isLoggedIn,isOwner, wrapAsync(reviewController.createReview));

//DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isOwner,isReview, wrapAsync(reviewController.destroyListing));


module.exports = router;