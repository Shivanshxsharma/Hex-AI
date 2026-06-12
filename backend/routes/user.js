const express = require("express");
const router = express.Router();
const User= require("../models/userData");
const { getAuth } = require("@clerk/express");
const { createNewUser } = require("../middlewares/addNewUser");
const userData = require("../models/userData");

router.post("/user",async (req,res)=>{
    const {userId} =getAuth(req);
    
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


router.put("/setkeys", async (req, res) => {
  const { userId, apikey } = req.body;

  // 1. Validation check
  if (!userId || !apikey) {
    return res.status(400).json({ error: "User ID or API Key is missing" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: userId }, 
      { apikey: apikey },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    console.log("key configured succesfuly----")
    return res.json({
      "status": true,
      "key": `...........................${apikey.slice(-2)}`
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error while saving key" });
  }
});




router.get("/getkeys", async (req, res) => {
  try {
    const userId = req.headers['userid'] || req.headers['userId'];
    if(!userId) return res.status(500).json({error:"cant fetch keys right now , please try again after some time"})
    const user = await User.findOne({clerkId:userId})
    if(!user) return res.status(500).json({error:"cant fetch keys right now , please try again after some time"})
    
    if (!user.apikey) {
      return res.json({"status": false, "key": ""});
    }
    
    return res.json({"status":true,"key":`...........................${user.apikey.slice(-2)}`})
  } catch (error) {
    console.error("Error fetching keys:", error);
    return res.status(500).json({error: "Server error while fetching keys"});
  }
});


module.exports=router;