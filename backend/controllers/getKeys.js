const User= require("../models/userData");

async function getkeys(userId) {
    try {
        const user=await User.findOne({clerkId:userId})
        return user.apikey
    } catch (error) {
        console.log(error,"cant find any keys for the user")
        return
    }
}



module.exports=getkeys;