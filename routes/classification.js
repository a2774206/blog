var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const util = require('./../config/util');
var classSchema = require('../db/classification.js');
var article = require('../db/article.js')
const uuid = require('node-uuid');
// post 获取参数body-parser
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true })

// 标签查询
router.all('/select',urlencodedParser, function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	
	let token = req.body.token || req.query.token || req.headers['token'];
	
	let { name } = Object.assign(req.query,req.body)
	
	// 查询,暂不校验token
	classSchema.find({
		$or: [{
			tabname:{
				$regex: new RegExp(name,'i')
			}
		}]
	}, function(err, docs) {
		if (err) {
			res.json({
				status: 400,
				message: '标签不存在!'
			})
		} else {
			let count = 0,doc = JSON.parse(JSON.stringify(docs));
			function promises(i){
				return new Promise((resolve,reject)=>{
					article.count({
						classUuid:doc[i]['uuid'],
					},(err,counts)=>{
						if(!err){
							doc[i]['count'] = counts;
						}
						resolve();
					})
				})
			}
			async function countInit(){
				for(let i = 0; i< doc.length;i++){
					await promises(i);
				}
				res.json({
					status: 0,
					message: 'success',
					data: {
						doc
					}
				})
			}
			
			if(docs.length > 0) {
				countInit()
			}else{
				res.json({
					status: 0,
					message: 'success',
					data: {
						doc
					}
				})
			}
			
			
			
		}
	
	});

});
// 标签增加
router.all('/add',urlencodedParser, function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	let token = req.body.token || req.query.token || req.headers['token'];
	let {name,remarks} = Object.assign(req.query,req.body);
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!name) {
				res.json({
					status: 400,
					message: '标签名不能为空'
				})
			} else {
				classSchema.create({
						tabname: name,
						uuid: uuid.v1(),
						remarks: remarks || ''
					}, function(err, data) {
						if (err) {
							let message = '';
							console.log(err)
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
router.all('/update',urlencodedParser, function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	let token = req.body.token || req.query.token || req.headers['token'];
	let {uuid,name,remarks} = Object.assign(req.query,req.body);
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!uuid ) {
				return res.json({
					status: 400,
					message: '标签uuid不能为空'
				})
				
			}
			if (!name && !remarks) {
				res.json({
					status: 400,
					message: '标签名或备注不能为空'
				})
			} else {
				let updataData = {};
				
				 name? updataData['tabname'] = name : '';
				remarks? updataData['remarks'] = remarks : '';
				 
				classSchema.update({uuid}, {$set: updataData},function(err,raw){
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
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	
	let token = req.body.token || req.query.token || req.headers['token'];
	
	let { uuid } = Object.assign(req.query,req.body);
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!uuid) {
				res.json({
					status: 400,
					message: 'uuid不能为空'
				})
			} else {
				classSchema.remove({
						uuid
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
