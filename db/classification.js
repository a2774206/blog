const mongoose = require('mongoose');
let classSchema = new mongoose.Schema({
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

 module.exports = mongoose.model('classSchema', classSchema);
