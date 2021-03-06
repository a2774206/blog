const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let articleSchema = new Schema({
  classUuid: {
    type: String,
    required: true,
  },
  uuid:{
	  type:String,
	  unique: true,
	  required: true
  },
  author:{
	  type:String,
	  required:true
  },
  title:{
  	  type:String,
  	  required: true
  },
  content:{
	  type:String,
	  required: true
  },
  created_time:{
	  type:String,
	  default:() => +new Date()
  },
  updated_time:{
	  type:String
  },
  
});
module.exports = mongoose.model('articleSchema',articleSchema,'articleSchema');
