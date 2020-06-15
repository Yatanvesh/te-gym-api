const express = require('express');
const router = express.Router();

const signJwt = require('../auth').sign;

const UserData = require('../models/userData');
const User = require('../models/user');

const createUser = async (email, password, userType) => {
  const user = await User.create({
    email,
    password,
    userType
  });
  if (!(user && user.email))
    throw new Error("User creation failed");
  const userData = await UserData.create({ // create basic userData object for future updation
    email,
    userType
  });
  if (!(userData && userData.email))
    throw new Error("UserData creation failed");
  return user;
}

router.post('/trainer', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, 'COACH'); // auto handles error
    const jwt = await signJwt({username: email});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/user', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, 'USER'); // auto handles error
    const jwt = await signJwt({username: email});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
