const cuid = require('cuid');
const {isEmail} = require('validator');

const db = require('../config/db');

const Model = db.model('Post', {
  _id: {
    type: String,
    default: cuid
  },
  email: emailSchema({
    required: true
  }),
  postType: {
    type: String,
    default: 'TEXT',
    enum: ['TEXT', 'IMAGE']
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  textContent: {
    type: String,
    required: true
  },
  postImageUrl: {
    type: String
  },
  // comments:{  } // create comment model
})

async function get(_id) {
  const model = await Model.findOne(
    {_id},
    {__v: 0}
  );
  return model;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts;
  const model = await Model.find({}, {__v: 0})
    .sort({dateCreated: -1})
    .skip(offset)
    .limit(limit)
  return model;
}

async function remove(_id) {
  await Model.deleteOne({
    _id
  })
}

async function create(fields) {
  const model = new Model(fields);
  await model.save();
  return model;
}

async function edit(_id, change) {
  const model = await get(_id);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  await model.save();
  return await get(_id);
}


function emailSchema(opts = {}) {
  const {
    required
  } = opts
  return {
    type: String,
    required: !!required,
    lowercase: true,
    validate: [{
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
    ]
  }
}

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Model
}