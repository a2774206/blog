### 返回码
+	 0   	成功
+	 400 	正常返回错误（参数未传等）
+	 401 	token 失效


### 接口说明

####  登录
+	  /login 		
	+	参数：username,password
	+	 响应：type:Object	

+	 /users/update   
	+ 	参数：username,pwd,modifyPwd
	+	 响应：type:Object

####  分类
+	  /classification/add 
	+	 参数：name，remarks
	+	 响应：type:Object
		
+	  /classification/select 
	+	 响应：type:Object
		
+	  /classification/del 
	+	 参数：uuid
	+	 响应：type:Object
	
+	  /classification/update  
	+	 参数：uuid,remarks,name

####  文章
+	/article/find  
	+	参数：pageSize,pageNum,keywords,classUuid
	+	响应：type:Object
	   
+	/article/create
	+	 参数：title,classUuid,content,author
	+	 响应：type：Object
	
+	/article/update
	+	参数：title,content,uuid
	+	响应：type：Object

+	/article/find
	+	参数	：pageSize,pageNum,keywords,classUuid
	+	响应：type:Object

+	/article/find_details
	+   参数：uuid
	+   响应：type:Object

+	/article/del
	+	参数：uuid
	+	响应 type：Object
	
+	/upload/images
	+	参数：formData
	+	响应：type:Object