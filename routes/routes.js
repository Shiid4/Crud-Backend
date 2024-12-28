const express = require("express"); //import express framework
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Home Page" }); //pass variable 'title' with value "Home Page" to the view
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add User" }); //pass variable 'title' with value "Add User" to
});

module.exports = router;
