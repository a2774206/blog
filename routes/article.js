var express = require('express');
var router = express.Router();
const util = require('./../config/util');
var article = require('../db/article.js');
var classification = require('../db/classification.js');

// post 获取参数body-parser
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: true })

const uuid = require('node-uuid');


router.all('/find',urlencodedParser, function(req, res, next) {
	//  解决跨域
	var { pageSize = 10,pageNum = 1,keywords,classUuid } = Object.assign(req.query,req.body);
	
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	
	article.find({}, function(err, ification) {
		if (err) {
			return res.json({
				status: 400,
				message: '发生错误!'
			});
		} else {
			var total = 0;
			const reg = new RegExp(keywords, 'i');
			//  暂时只提供标题模糊搜索
			//  分类 -> 模糊搜索 ->翻页
			article.count({
				$or: [{
					classUuid:{
						$regex: new RegExp(classUuid)
					},
					title: {
						$regex: reg
					}
				}]
			},(err,count) => {
				if(!err){
					total = count;
				}
			})
			
			article.find({
				$or: [{
					classUuid:{
						$regex: new RegExp(classUuid)
					},
					title: {
						$regex: reg
					}
				}]
			}).skip((pageNum - 1) * pageSize).limit(+pageSize).exec(function(err, data) {
				if (err) {
					res.json({
						status: 0,
						message: 'error'+err
					})
				} else {
					res.json({
						status: 0,
						message: 'success',
						data,
						count:total
					})
				}

			});
		}
	})


});

// 创建文章
router.all('/create',urlencodedParser,function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	let token = req.body.token || req.query.token || req.headers['token'];
	let { title,classUuid,content,author } = Object.assign(req.query,req.body)
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!title) {
				return res.json({
					status: 400,
					message: '标题不能为空'
				});
			} else if (!classUuid) {
				return res.json({
					status: 400,
					message: '分类uuid不正确'
				});
			} else if (!content) {
				return res.json({
					status: 400,
					message: '内容不能为空'
				});
			} else if (!author) {
				return res.json({
					status: 400,
					message: '作者不能为空'
				})
			} else {
				classification.find({
					uuid: classUuid
				}, function(err, data) {
					if (err) {
						return res.json({
							status: 400,
							message: "文章标签uuid未知错误" + err
						})
					} else {
						if (data.length < 1) {
							return res.json({
								status: 400,
								message: "文章标签uuid不存在"
							})
						}
					}
					article.create({
						title,
						classUuid,
						content,
						uuid: uuid.v1(),
						author,
						updated_time: +new Date()
					}, function(err, data) {
						if (err) {
							res.json({
								status: 400,
								message: "文章未知错误" + err
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
				})

			}


		} else {
			res.json(r);
		}
	})
});

// 修改|编辑文章
router.all('/update',urlencodedParser, function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	let token = req.body.token || req.query.token || req.headers['token'];
	let { uuid, title, content} = Object.assign(req.query,req.body)
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			// 查文章是否存在
			article.findOne({
				uuid
			}, function(err, content) {
				if (err) {
					return res.json({
						status: 400,
						message: '发生错误!'
					});
				} else {
					if (content) {
						article.update({
							$set: {
								title,
								content,
								update_time: +new Date()
							}
						}, function(err, data) {
							return res.json({
								status: 0,
								message: 'success',
								data
							})
						})
					} else {
						res.json({
							status: 400,
							message: '文章不存在!'
						});
					}
				}
			})
		} else {
			res.json(r);
		}

	});

});

//删除
router.all('/del',urlencodedParser, function(req, res, next) {
	//  解决跨域
	if( util.CrossDomain(req, res, next) ) return res.send({status:200});
	let token = req.body.token || req.query.token || req.headers['token'];
	let { uuid } = Object.assign(req.query,req.body);
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!uuid) {
				return res.json({
					status: 400,
					message: '标题不能为空'
				});
			} else {
				article.find({
					uuid
				}, function(err, data) {
					if (err) {
						return res.json({
							status: 400,
							message: "文章uuid未知错误" + err
						})
					} else {
						if (data.length < 1) {
							return res.json({
								status: 400,
								message: "文章标签uuid不存在"
							})
						}
					}
					article.remove({
						uuid
					}, function(err, data) {
						if (err) {
							res.json({
								status: 400,
								message: "文章删除未知错误" + err
							});
						} else {
							res.json({
								status: 0,
								message: '删除成功'
							})
						}

					})
				})

			}


		} else {
			res.json(r);
		}
	})
});

module.exports = router;
