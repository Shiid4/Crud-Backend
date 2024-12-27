const express = require("express"); //import express framework 
const router = express.Router();

router.get("/users", (req, res) => {
    res.send("All Users");
})

module.exports = router; 