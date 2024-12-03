const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn, isOwner, validateList} = require("../middleware.js");
const listenController = require("../controller/listings.js");
 const multer  = require('multer')
 const upload = multer({ dest: 'uploads/' })

router
.route("/")
.get(wrapAsync(listenController.index))
.post(isLoggedIn,validateList, wrapAsync(listenController.createListing));


///new route form add
router.get("/new", isLoggedIn,listenController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listenController.showListing))
.put(isLoggedIn,isOwner,validateList, wrapAsync(listenController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listenController.destroyListing));



 ///edit form route
 router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listenController.rendereditFrom));
 
 
 module.exports = router;