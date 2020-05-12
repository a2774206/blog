var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const util = require('./../config/util');


/* GET home page. */
router.all('/', function(req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Origin','*');
	//允许的header类型
	res.header("Access-Control-Allow-Headers", "content-type,token");
	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	if (req.method.toLowerCase() == 'options') {
	      res.json(200);  // 让options尝试请求快速结束
		  
	 } 
	 var token = req.body.token || req.query.token || req.headers['token'];
	 
	    if (token) {      
	        // 解码 token (验证 secret 和检查有效期（exp）)
	        jwt.verify(token, util.secret, function(err, decoded) {      
	              if (err) {
					res.json({ success: false, message: 'token 已经无效.' });    
	              } else {
	                // 如果验证通过，在req中写入解密结果
	                // req.decoded = decoded;  
	                // console.log(decoded)
					  res.json({a:1});
	          }
	        });
			 
	      } else {
	        // 没有拿到token 返回错误 
	        res.json({ 
	            success: false, 
	            message: '没有找到token.' 
	        });
	      }
		 
});




module.exports = router;
