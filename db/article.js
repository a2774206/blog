const mongoose = require('mongoose');
let articleSchema =  new mongoose.Schema({
  classUuid: {
    type: String,
    required: true,
  },
  uuid:{
	  type:String,
	  unique: true,
	  required: true
  },
  title:{
  	  type:String,
  	  required: true
  },
  content:{
	  type:String,
	  required: true
  },
});

 module.exports = mongoose.model('articleSchema', articleSchema);
