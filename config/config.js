module.exports =  {
	database: 'mongodb://localhost/blog',
	expiresTime:72000,
	payload :{
		user:'admin',
		password:'admin'    
	},
	//token 数据
	secret:'a2774206',//  密钥
	
	// 初始化后台帐号密码
	accounts:{
		username:'admin',
		password:'admin'
	}
}