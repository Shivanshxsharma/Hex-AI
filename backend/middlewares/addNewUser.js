const User = require("../models/userData");
const { clerkClient } = require("@clerk/express");

async function createNewUser(clerkId) {

  try {
      const existingUser = await getUser(clerkId);

  if (!existingUser) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const user = await User.create({
      clerkId: clerkUser.id,
      name: clerkUser.firstName,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      imageUrl: clerkUser.imageUrl || "",
    });

    return user;
  }

  return existingUser;
  } catch (error) {
    console.error(error+ "adding user")
  }

}

async function getUser(clerkId) {
  try {
     const user = await User.findOne({ clerkId });
  return user; 
  } catch (error) {
    console.error(error + "geetting user")
  }

}

module.exports = { createNewUser, getUser };
