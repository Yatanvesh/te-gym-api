const cuid = require('cuid');
const {isEmail} = require('validator');

const db = require('../config/db');

const Model = db.model('Comment', {
  _id: {
    type: String,
    default: cuid
  },
  email: emailSchema({
    required: true
  }),
  dateCreated: {
    type: Date,
    default: Date.now
  },
  commentText: {
    type: String,
    required: true
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
})

async function get(_id) {
  const model = await Model.findOne(
    {_id},
    {__v: 0}
  );
  return model;
}

async function remove(_id, email) {
  const model = await get(_id);
  if(!model) throw new Error("Comment not found");
  if (model.email === email){
    await Model.deleteOne({
      _id
    });
    return true;
  }
  else throw new Error("Not authorised to delete comment");
}

async function create(fields) {
  const model = new Model(fields);
  await model.save();
  return model;
}

async function edit(_id, email, commentText) {
  const model = await get(_id);
  if(!model) throw new Error("Comment not found");
  if (model.email !== email) throw new Error("Not authorised to edit comment");

  model.commentText = commentText;
  model.isEdited = true;
  // model.dateCreated = Date.now(); // lets look into this later, whether to update date created or include updation time
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
  create,
  edit,
  remove,
  model: Model
}