var express = require('express');
var router = express.Router();
const util = require('./../config/util');
var article = require('../db/article.js');
var classification = require('../db/classification.js')
const uuid = require('node-uuid');


router.all('/find', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	article.find({}, function(err, ification) {
		if (err) {
			return res.json({
				status: 400,
				message: '发生错误!'
			});
		} else {

			const reg = new RegExp(req.query.title, 'i')
			article.find({
				$or: [{
					title: {
						$regex: reg
					}
				}]
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


});

// 创建文章
router.all('/create', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!req.query.title) {
				return res.json({
					status: 400,
					message: '标题不能为空'
				});
			} else if (!req.query.classUuid) {
				return res.json({
					status: 400,
					message: '分类uuid不正确'
				});
			} else if (!req.query.content) {
				return res.json({
					status: 400,
					message: '内容不能为空'
				});
			} else if (!req.query.author) {
				return res.json({
					status: 400,
					message: '作者不能为空'
				})
			} else {
				classification.find({
					uuid: req.query.classUuid
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
						title: req.query.title,
						classUuid: req.query.classUuid,
						content: req.query.content,
						uuid: uuid.v1(),
						author: req.query.author,
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
router.all('/update', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			// 查文章是否存在
			article.findOne({
				uuid: req.query.uuid
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
								title: req.query.title,
								content: req.query.content,
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
router.all('/del', function(req, res, next) {
	//  解决跨域
	util.CrossDomain(req, res, next);
	let token = req.body.token || req.query.token || req.headers['token'];
	//  校验 token/登录状态
	util.checkToken(token, res).then((r) => {
		if (!r) {
			if (!req.query.uuid) {
				return res.json({
					status: 400,
					message: '标题不能为空'
				});
			} else {
				article.find({
					uuid: req.query.uuid
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
						uuid: req.query.uuid
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
