
// const cuid = require('cuid');
const {isEmail} = require('validator');

const db = require('../config/db');
const {userTypes} =  require("../constants")

const Model = db.model('UserData', {
  _id: {
    type: String,
    required:true,
    // default: cuid
  },
  email: emailSchema({
    required: true
  }),
  userType: {type: String, default: userTypes.USER},
  name: {
    type: String,
    // required: true
  },
  phone: {
    type: String
  },
  gender: {
    type: String
  },
  displayPictureUrl: {
    type: String
  },
  bmi: {
    type: Number
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  chest: {
    type: Number
  },
  biceps: {
    type: Number
  },
})

async function get(email) {
  const model = await Model.findOne(
    {email},
  );
  return model;
}
async function getById(_id) {
  const model = await Model.findOne(
    {_id},
  );
  return model;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts;
  const model = await Model.find({}, {__v: 0})
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
  if (fields._id) {
    const model = await getById(fields._id);
    if (model)
      return model; // Can later be changed to update and return
  }
  const model = new Model(fields);
  await model.save()
  return model;
}

async function edit(userId, change) {
  const model = await getById(userId);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
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
  getById,
  list,
  create,
  edit,
  remove,
  model: Model
}