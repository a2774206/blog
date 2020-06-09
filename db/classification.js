const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let classSchema = new Schema({
  tabname: {
    type: String,
    required: true,
	unique:true,
  },
  uuid:{
	  type:String,
	  unique: true,
	  required: true
  },
  remarks:{
	  type:String
  }
});

 module.exports = mongoose.model('classSchema', classSchema,'classSchema');
