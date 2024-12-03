const express = require("express");
const mongoose = require("mongoose");
const initdata = require("./data");
const Listing  = require("../models/listing.js");

main().then((res)=>{
  console.log("connection is ok");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wander');
};

let initDB = async()=>{
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>({... obj, owner: "673f021e14ab52042ba30a40"}))
  await Listing.insertMany(initdata.data);
  console.log("data save");
};

initDB();