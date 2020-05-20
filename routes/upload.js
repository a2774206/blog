var express = require('express');
var router = express.Router();
const util = require('./../config/util');
var multer = require('multer');
var bodyParser = require('body-parser');
//生成的图片放入uploads文件夹下
var upload = multer({dest:'uploads/images'});

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true })

router.all('/',urlencodedParser, function(req, res, next) {
	util.CrossDomain(req,res,next);
	var token = req.body.token || req.query.token || req.headers['token'];
	util.checkToken(token, res).then((r) => {
		// res.send(r)
		console.log(r)
		if(!r){
			console.log(req.query);
			res.json({a:3})
		}else{
			res.json(r)
		}
	})
		 
});




module.exports = router;
