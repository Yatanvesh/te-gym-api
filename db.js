const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI || 'mongodb+srv://boi:244466666@cluster0-nssjy.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true }
)

module.exports = mongoose