const cuid = require('cuid');
const {isEmail} = require('validator');

const db = require('../config/db');

const Model = db.model('Slot', {
  _id: {
    type: String,
    default: cuid
  },
  startTime:{
    type:Number,
    required:true
  },
  duration:{
    type:Number,
    default: 30
  },
  assignedTo:{
    type:String,
    ref:'User',
    index:true,
    default:null
  },
  days:{
    type:Array,
    default: ['MON', 'TUE', 'WED', 'THU', 'FRI','SAT','SUN']
  }
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


module.exports = {
  get,
  create,
  edit,
  remove,
  model: Model
}