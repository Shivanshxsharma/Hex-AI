const User = require("../models/userData");
const { clerkClient } = require("@clerk/express");

async function createNewUser(clerkId) {
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
}

async function getUser(clerkId) {
  const user = await User.findOne({ clerkId });
  return user;
}

module.exports = { createNewUser, getUser };
