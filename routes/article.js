var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const util = require('./../config/util');
var classification = require('../db/classification.js')
const uuid = require('node-uuid');


router.all('/select', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			classification.find({}, function(err, ification) {
				if (err) {
					return res.json({
						status: 400,
						message: '发生错误!'
					});
				} else {
					let name = !!req.query.name ? {
						name: req.query.name
					} : {};
					classification.find({
						name
					}, function(err, data) {
						if (err) {
							res.json({
								status: 0,
								message: '标签不存在!'
							})
						} else {
							res.json({
								status: 0,
								message: 'success',
								data: {
									data
								}
							})
						}

					});
				}
			})
		} else {
			res.json(r);
		}

	});

});

router.all('/add', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!req.query.name) {
				res.json({
					status: 400,
					message: '标签名不能为空'
				})
			} else {
				classification.create({
						tabanme: req.query.name,
						uuid: uuid.v1(),
						remarks: req.query.remarks || ''
					}, function(err, data) {
						if (err) {
							let message = '';
							console.log(err.code)
							switch(+err.code){
								case 11000:
								message = "标签已存在,请修改"
								break;
								default:
								message = '发生错误!'
								
							}
							res.json({
								status: 400,
								message,
								data:{err}
							});
						} else {
							res.json({
								status: 0,
								message: 'success',
								data: {
									data
								}
							})
						}
					
					})
			}
		} else {
			res.json(r);
		}
	})
});


module.exports = router;
