var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const util = require('./../config/util');
var usersSchema = require('../db/users.js');
// post 获取参数body-parser
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true })

/*  登录成功返回 jwt */
router.all('/', urlencodedParser,function(req, res, next) {
	//  解决跨域
	if(util.CrossDomain(req,res,next)) return res.send({status:200});
	let { username,password } = Object.assign(req.query,req.body);
	usersSchema.find({},function(err,users){
		if(err){
			res.json({status:400,message:'发生错误!'});
		}else{
			usersSchema.find({
				username
			}, function(err, docs){
		        if(err) {
					res.json({status:400,message:'帐号不存在!'})
				}else{
					if( docs[0] && password == docs[0].password){
						// 创建令牌
						 let token = jwt.sign(config.payload, config.secret, {expiresIn:config.expiresTime})

						res.json({status:0,message:'登录成功!',data:{token}})
					}else{
						res.json({status:400,message:'密码不匹配!'})
					}
				}
				
			});
		}
	})
	
  
});


module.exports = router;
