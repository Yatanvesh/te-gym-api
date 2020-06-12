const jwt = require('jsonwebtoken');
const passport = require('passport')
const Strategy = require('passport-local').Strategy
// const expressSession = require('express-session')
const Trainers = require('./models/trainers');
const Customers = require('./models/customers');
const bcrypt = require('bcrypt');

const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
// const sessionSecret = process.env.SESSION_SECRET || 'random string of words'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'
const jwtOpts = {
  algorithm: 'HS256',
  expiresIn: '30d'
}

passport.use(adminStrategy());

const login = async (req, res) => {
  const token = await sign({
    username: req.username
  });
  res.json({
    success: true,
    token: token
  })
}

const authenticate = passport.authenticate('local', {
  session: false
});

async function ensureUser(req, res, next) {
  const jwtString = req.headers.authorization;
  const payload = await verify(jwtString);
  if (payload.username) {
    req.user = payload;
    return next()
  }

  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

function adminStrategy() {
  return new Strategy(async function (username, password, cb) {
    try {
      // First check in trainers, then customers
      let user = await Trainers.get(username);
      if (!user){
        user = await Customers.get(username);
      }
      if(!user)return cb(null, false);
      const isUser = await bcrypt.compare(password, user.password);
      if (isUser) return cb(null, {
        username: user.username
      })
    } catch (err) {}
    cb(null, false)
  })
}

async function sign(payload) {
  const token = await jwt.sign(payload, jwtSecret, jwtOpts);
  return token;
}

async function verify(jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '')
  try {
    const payload = await jwt.verify(jwtString, jwtSecret)
    return payload
  } catch (err) {
    err.statusCode = 401
    throw err
  }
}

module.exports = {
  authenticate,
  login,
  ensureUser
}