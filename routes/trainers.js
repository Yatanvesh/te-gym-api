var express = require('express');
var router = express.Router();
const Trainers = require('../models/trainers');

router.get('/', async function (req, res, next) {
  let trainers = await Trainers.list();
  res.json({trainers});
});

module.exports = router;
