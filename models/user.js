const cuid = require('cuid');
const {isEmail} = require('validator');

const {hashPassword} = require('../utility/utility');
const db = require('../config/db');

const Model = db.model('User', {
  _id: {
    type: String,
    default: cuid
  },
  password: {
    type: String,
    maxLength: 120,
    required: true
  },
  email: emailSchema({
    required: true
  }),
  userData: {type: String, ref: 'UserData', index: true},
  userType: {type: String, default: 'USER', enum: ['USER', 'COACH'], required:true}
})

async function get(email) {
  const model = await Model.findOne({
    email
  });
  return model;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25, userType = ''
  } = opts
  const conditions = !!userType ? {userType}:{};
  const model = await Model.find(conditions, {password: 0, _id: 0, __v: 0})
    .sort({
      _id: 1
    })
    .skip(offset)
    .limit(limit)
  return model;
}

async function remove(email) {
  await Model.deleteOne({
    email
  })
}

async function create(fields) {
  const model = new Model(fields)
  await hashPassword(model)
  await model.save()
  return model;
}

async function edit(email, change) {
  const model = await get(email);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  if (change.password) await hashPassword(model);
  await model.save();
  return model;
}

function emailSchema(opts = {}) {
  const {
    required
  } = opts
  return {
    type: String,
    required: !!required,
    unique: true,
    lowercase: true,
    validate: [{
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    },
      {
        validator: function (email) {
          return isUnique(this, email)
        },
        message: props => 'Email already in use'
      }
    ]
  }
}

async function isUnique(doc, property) {
  const existing = await get(property);
  return !existing || doc._id === existing._id;
}

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Model
}