var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const util = require('./../config/util');
var classSchema = require('../db/classification.js')
const uuid = require('node-uuid');

// 标签查询
router.all('/select', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  查询,暂不校验token
	let name = !!req.query.name ? {
		name: req.query.name
	} : {};
	classSchema.find(name, function(err, docs) {
		if (err) {
			res.json({
				status: 400,
				message: '标签不存在!'
			})
		} else {
			res.json({
				status: 0,
				message: 'success',
				data: {
					docs
				}
			})
		}
	
	});

});
// 标签增加
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
				classSchema.create({
						tabname: req.query.name,
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
//  修改分类/标签
router.all('/update', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!req.query.uuid ) {
				return res.json({
					status: 400,
					message: '标签uuid不能为空'
				})
				
			}
			if (!req.query.name && !req.query.remarks) {
				res.json({
					status: 400,
					message: '标签名或备注不能为空'
				})
			} else {
				let updataData = {};
				
				 req.query.name? updataData['tabname'] = req.query.name : '';
				 req.query.remarks? updataData['remarks'] = req.query.remarks : '';
				 
				classSchema.update({uuid:req.query.uuid}, {$set: updataData},function(err,raw){
					if(err){
						res.json({
							status: 400,
							message: '更新标签未知错误'
						})
					}else{
						res.json({
							status: 200,
							message: '更新成功',
							data:{
								raw
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


// 删除
router.all('/del', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!req.query.uuid) {
				res.json({
					status: 400,
					message: 'uuid不能为空'
				})
			} else {
				classSchema.remove({
						uuid: req.query.uuid 
					}, function(err, ification) {
						if (err) {
							res.json({
								status: 400,
								message:"删除未知错误",
								data:{err}
							});
						} else {
							res.json({
								status: 0,
								message: '删除成功',
								data: {
									ification
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
