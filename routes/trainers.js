const express = require('express');
const router = express.Router();
const UserData = require('../models/userData');

router.get('/', async function (req, res, next) {
  let trainers = await UserData.list({userType:'COACH'});
  res.json({trainers});
});

module.exports = router;
