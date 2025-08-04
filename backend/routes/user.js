const express = require("express");
const router = express.Router();
const User= require("../models/userData");
const { getAuth } = require("@clerk/express");
const { createNewUser } = require("../middlewares/addNewUser");
const userData = require("../models/userData");

router.post("/user",async (req,res)=>{
    const {userId} =getAuth(req);
    console.log("user ID -"+userId);
    
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const newUser= await createNewUser(userId);
    res.status(201).json({ message: "User saved", user: newUser });
})


router.get("/user", async (req, res) => {
  try {
    const users = await User.find(); // Correctly fetch user documents
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports=router;