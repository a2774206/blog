const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
	unique: true
  },
  password: {
    type: String,
    required: true
  },
  jurisdiction:{
	//  管理员权限
	type:Boolean,
	required: true
  }
});

 module.exports = mongoose.model('userSchema', userSchema);
