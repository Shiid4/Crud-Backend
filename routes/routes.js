const express = require("express"); //import express framework
const router = express.Router();
const User = require("../models/users");
const multer = require("multer"); //Nodejs library to handle multipart/form-data ( commonly for file uploads )

//image upload
var storage = multer.diskStorage({
  //determine where the file will be upload
  destination: function (req, file, cb) {
    //cb is callback function ( specify folder path )
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    //determine the name of the uploaded file
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image"); //for single image ( because we are uploading one image at a time ) image is the name

//insert an user into database route
router.post("/add", upload, async (req, res) => {
  // upload(req, res, async function (err) { //my fault is override
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", type: "danger" });
    }
    // Log the body to see the parsed data
    //console.log("req.body:", req.body);
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
      });
      console.log("Inserting user:", user);
      await user.save();
      console.log("User saved successfully!");
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    } catch (err) {
      console.error("Error inserting user:", err);
      if (err.name === "ValidationError") {
        res.status(400).json({
          message: "Validation failed: " + err.message,
          type: "danger",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error: " + err.message,
          type: "danger",
        });
      }
    }
  // });
});

//get all users route
router.get("/", async (req, res) => {
  try{
    const users = await User.find().exec();
    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (err) {
    res.json({message: err.message})
  }
 
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add User" }); //pass variable 'title' with value "Add User" to
});

module.exports = router;
