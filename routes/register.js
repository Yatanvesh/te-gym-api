const express = require('express');
const router = express.Router();

const Trainers = require('../models/trainers');

router.post('/trainer', async function(req, res, next) {
  const trainer = await Trainers.create(req.body);
  const {
    email
  } = trainer;
  res.json({
    email
  });
});

router.post('/customer', function(req, res, next) {
  res.send('customer');
});

module.exports = router;
