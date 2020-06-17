const cuid = require('cuid');

const db = require('../config/db');

const Model = db.model('Comment', {
  _id: {
    type: String,
    default: cuid
  },
  userId:{
    type:String,
    required:true
  },
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

async function remove(_id, userId) {
  const model = await get(_id);
  if(!model) throw new Error("Comment not found");
  if (model.userId === userId){
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

async function edit(_id, userId, commentText) {
  const model = await get(_id);
  if(!model) throw new Error("Comment not found");
  if (model.userId !== userId) throw new Error("Not authorised to edit comment");

  model.commentText = commentText;
  model.isEdited = true;
  // model.dateCreated = Date.now(); // lets look into this later, whether to update date created or include updation time
  await model.save();
  return model;
}

module.exports = {
  get,
  create,
  edit,
  remove,
  model: Model
}