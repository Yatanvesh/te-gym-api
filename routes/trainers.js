var express = require('express');
var router = express.Router();
const Users = require('../models/user');

router.get('/', async function (req, res, next) {
  let trainers = await Users.list({userType:'COACH'});
  res.json({trainers});
});

module.exports = router;
