var express = require('express');
var router = express.Router();
const util = require('./../config/util');
const usersSchema = require('../db/users.js')

// post 获取参数body-parser
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({
	extended: true
})


router.all('/update', urlencodedParser, function(req, res, next) {
	//  解决跨域
	// if (util.CrossDomain(req, res, next)) return res.send({
	// 	status: 200
	// });
	let token = req.body.token || req.query.token || req.headers['token'];
	let {
		username,
		pwd,
		modifyPwd
	} = Object.assign(req.query, req.body)
	//  校验 token/登录状态
	if (!username && !pwd && !modifyPwd) return res.json({
		status: 400,
		message: '填写完整!'
	});
	util.checkToken(token, res).then((r) => {
		if (!r) {
			// 查用户是否存在
			usersSchema.findOne({
				username
			}, function(err, doc) {
				if (err) {
					return res.json({
						status: 400,
						message: '未知错误:' + err
					});
				} else {
					if( !doc ) return res.json({
						status: 400,
						message: '用户不存在!'
					}); 
					if (doc.password != pwd) {
						return res.json({
							status: 400,
							message: '原密码不正确!'
						});
					}
					if (doc) {
						usersSchema.update({
							username
						}, {
							$set: {
								password: modifyPwd
							}
						}, function(err, data) {
							if (err) return res.json({
								status: 400,
								message: err
							})
							return res.json({
								status: 0,
								message: 'success'
							})
						})
					} else {
						res.json({
							status: 400,
							message: '用户不存在!'
						});
					}
				}
			})
		} else {
			res.json(r);
		}

	});

});



module.exports = router;
