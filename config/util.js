const jwt = require('jsonwebtoken');
const config = require('./../config/config');
module.exports = {
	// 跨域,处理 opions
	CrossDomain : (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		// 允许的header类型
		res.header("Access-Control-Allow-Headers", "token,Origin, X-Requested-With, Content-Type, Accept");
		//跨域允许的请求方式 
		res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
		// res.header('Access-Control-Allow-Credentials', true);
		if (req.method.toLowerCase() == 'options') {
			return 200; // 让options尝试请求快速结束
		} else {
			next();
		}
	},
	checkToken: async (token,res) =>{
			//  校验 token
				if (token) {
			       // 解码 token (验证 secret 和检查有效期（exp）)
				   let json = await jwt.verify(token, config.secret, function(err, decoded) {      
			             if (err) {
			   				return { status:401, message: 'token已经失效' };
			             }
			       });
				  return json;
			   					 
			     } else {
			       // 没有拿到token 返回错误 
			      return { 
			           status: 401, 
			           message: '没有找到token' 
			      }
			   			   
			     }
		   
	}
}
