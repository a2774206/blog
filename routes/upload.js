var express = require('express');
var app = express();
var router = express.Router();
const util = require('./../config/util');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');

let multerObj = multer({
	dest: './public/images'
}) // 设置文件上传目录
app.use(multerObj.any());

router.post('/images', multerObj.single('file'), function(req, res, next) {

	if (util.CrossDomain(req, res, next)) return res.send({
		status: 200
	})
	
	var token = req.body.token || req.query.token || req.headers['token'];
	util.checkToken(token, res).then((r) => {
		if (!r) {
			let file = req.file;

			let filename = "images/" + file.filename;
			// 判断上传的图片格式
			// mimetype：该文件的Mime type
			if (file.mimetype == "image/jpeg") {
				filename += ".jpg";
			}
			if (file.mimetype == "image/png") {
				filename += ".png";
			}
			if (file.mimetype == "image/gif") {
				filename += ".gif";
			}
			fs.renameSync(file.path, "public/" + filename);
			console.log(req)
			res.json({
				status: 0,
				message: 'success',
				Imageurl: filename
			})
		} else {
			res.send({
				status: 401,
				message: 'token失效'
			})
		}
	}).catch((err) => {
		console.log(err)
	})

});




module.exports = router;
