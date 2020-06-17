const express = require('express');
const router = express.Router();

const signJwt = require('../auth').sign;
const TrainerData = require('../models/trainerData');
const UserData = require('../models/userData');
const User = require('../models/user');
const Package = require('../models/package');

const {userTypes} = require("../constants")

const createUser = async (email, password, userType) => {
  const user = await User.create({
    email,
    password,
    userType
  });
  if (!(user && user.email))
    throw new Error("User creation failed");
  const {_id} = user;
  const data = userType === userTypes.TRAINER ?
    await TrainerData.create({email, _id}) :
    await UserData.create({email, _id});
  if (!(data && data.email))
    throw new Error("user data creation failed");

  if (userType === userTypes.TRAINER) {
    // Create a default package and add it
    const package_ = await Package.create();
    if (!package_) throw new Error("Error in creating package");

    const trainer = await TrainerData.addPackage(email, package_._id);
    if (!trainer) throw new Error("Error in adding default package");
  }

  return user;
}

router.post('/trainer', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    const {userId} = await createUser(email, password, userTypes.TRAINER); // auto handles error
    const jwt = await signJwt({userEmail: email, userType: userTypes.TRAINER, userId});
    res.json({email, userId, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/user', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    const {userId} = await createUser(email, password, userTypes.USER); // auto handles error
    const jwt = await signJwt({userEmail: email, userType: userTypes.USER, userId});
    res.json({email, userId, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
