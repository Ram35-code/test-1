require('dotenv').config()
console.log(process.env);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Express.Error.js");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter  = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const dbUrl = process.env.ATLASDB_URL;

main().then((res)=>{
  console.log("connection is ok");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const store =  MongoStore.create({
 mongoUrl: dbUrl,
 crypto:{
  secret: process.env.SECRET,
 },
 touchAfter: 24 * 3600,
});

store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 17 * 24 * 60 * 60 * 1000,
    maxAge: 17 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

// app.get("/", (req,res)=>{
//   res.send("Hii i am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "Page not found."));
});

app.use((err,req,res,next)=>{
  let {status = 500, message = "Somethink went wrong."} = err;
  res.status(status).render("listing/error.ejs", {message});
});

app.listen(port, ()=>{
  console.log(`app is listen ${port}`);
});