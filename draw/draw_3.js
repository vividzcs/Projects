/**
* 基类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
*/
function Shape(color='#000',lineWidth=1,shape)
{
    this.color = color;  //线的颜色
    this.lineWidth = lineWidth;  //画线的宽度 
    this.shape = shape;  
}

/**
* 曲线类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
* @param x array 曲线走过的x坐标位置
* @param y array 曲线走过的y坐标位置
*/
function Curve(color,lineWidth,shape,x,y)
{
    Shape.call(this,color,lineWidth,shape);
    this.x = x;
    this.y = y;
}

/**
* 直线类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
* @param orignalX double 直线的起始x坐标
* @param orignalY double 直线的起始y坐标
* @param lastX double 直线的结束y坐标
* @param lastY double 直线的结束y坐标
*/
function Line(color,lineWidth,shape,orignalX,orignalY,lastX,lastY)
{
	Shape.call(this,color,lineWidth,shape);
	this.orignalX = orignalX;
	this.orignalY = orignalY;  //起始的位置
	this.lastX = lastX;
	this.lastY = lastY; //结束的位置
}

/**
* 圆类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
* @param x double 圆心x坐标
* @param y double 圆心y坐标
* @param r double 半径
*/
function Circle(color,lineWidth,shape,x,y,r)
{
	Shape.call(this,color,lineWidth,shape);
	this.x = x;
	this.y = y;  //圆心
	this.r = r; //半径
}

/**
* 椭圆类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
* @param x double 椭圆焦点x坐标
* @param y double 椭圆焦点y坐标
* @param a double 椭圆长半轴
* @param b double 椭圆短半轴
*/
function Ellipse(color,lineWidth,shape,x,y,a,b)
{
	Shape.call(this,color,lineWidth,shape);
	this.x = x;
	this.y = y;  //圆心
	this.a = a; //
	this.b = b; //
}

/**
* 矩形类
* @param color string 颜色
* @param lineWidth int 画的线的宽度
* @param shape int 形状类型
* @param x double 矩形左上角x坐标
* @param y double 矩形左上角y坐标
* @param width double 矩形宽
* @param height double 矩形高
*/
function RectAngle(color,lineWidth,shape,x,y,width,height)
{
	Shape.call(this,color,lineWidth,shape);
	this.x = x;
	this.y = y;  //左上角的位置
	this.width = width;  //宽
	this.height = height;  //高
}

/**
* MyCanvas整个图板的工厂，负责所有对对象的操作。
* 相当于Model层
*/
function MyCanvas()
{
	var _this = this;
	var myCanvas = document.getElementById("myCanvas");;
	var context = myCanvas.getContext('2d');;
	var action = 1;  //动作，1是画图,2是橡皮擦
	var shape = 11;  //画的形状
	var color = '#000';  //线的颜色
	var lineWidth = 1;  //画线的宽度
	var orignalX,orignalY;  //起始的位置
	var lastX,lastY; //结束的位置
	var width = myCanvas.width ,height = myCanvas.height;
	var data = [];  //用来保存形状
	var nowData;
	var isMouseDown = false;
	var x = [],y = [];
	
	/**
	* 得到Canvas对象
	* @return object 返回Canvas对象
	*/
	this.getMyCanvas = function(){
		return myCanvas;
	}

	/**
	* 得到Context对象
	* @return object 返回Context对象
	*/
	this.getContext = function(){
		return context;
	}

	/**
	* 设置画图的动作,是画图还是擦除形状
	* @param oAction int 动作的编号
	*/
	this.setAction = function(oAction){
		// console.log('set action '+ oAction);
		action = oAction;
	}

	/**
	* 设置画图的形状
	* @param oShape int 形状编号
	*/
	this.setShape = function(oShape){
		// console.log(shape);
		shape = oShape;
		// console.log(shape);
	}

	/**
	* 设置画图的颜色
	* @param oAction string 颜色值
	*/
	this.setColor = function(oColor){
		color = oColor;
	}

	/**
	* 设置画图的宽度
	* @param oWidth int 宽度
	*/
	this.setStrokeWidth = function(oWidth){
		lineWidth = parseInt(oWidth);
		// console.log(typeof lineWidth);
	}

	/**
	* 保存画布到LocalStroage中
	* @param filename string 保存的文件名
	*/
	this.saveCanvas = function(fileName){
		// alert(fileName);
		var file = '';
		for(var i in data)
		{
			file +='{';
		    var tmp = data[i];
		    for(var j in tmp)
		    { 
		    	if(tmp[j] instanceof Array){
		    		file += j + ':[' + tmp[j].toString() + '],';
		    	}
		        else if(typeof tmp[j] == 'number' )
		        	file += j + ':' +tmp[j]+',';
		        else
		        	file += j + ':"' +tmp[j].toString()+'",';
		    }
		    file += '},';
		}
		file = '['+file+']';
		localStorage[fileName] = file;
		// console.log(localStorage[fileName]);
	}

	/**
	* 展示保存画布，从localStorage中读取对象，把名字放到openLi列表中
	* @param openLi object 列表对象引用
	*/
	this.openCanvas = function(openLi){
		var str = '打开<ul class="sublist"><ul style="width:140px;float:left">';//;
		for(var i in localStorage)
		{
			str += '<li onclick="canvasController.openACanvas(this.innerHTML)">'+i+'</li>';
		}
		str +='<li onclick="localStorage.clear();" style="color:red;text-align:center;clear:both">清空</li></ul>';
		openLi.innerHTML =str;
	}

	/**
	* 按照名字打开列表中保存的对象
	* @param filename string 保存的文件名
	*/
	this.openACanvas = function(fileName){
		console.log(fileName);
		data = [];
		data = eval(localStorage[fileName]);
		// console.log(data);
		//刷新画布
		_this.flushField();
	}

	/**
	* 重画，将画布清空，将对象数组清空
	*/
	this.reDraw = function(){
		context.clearRect(0,0,width,height);
		data = [];
	}

	/**
	* 撤销，只需将最近入栈的对象弹出，然后重画
	*/
	this.goBack = function(){
		data.pop();
		_this.flushField();
	}

	/**
	* 删除形状 
	* @param event object 每个方法都自带的对象，包含事件发生的信息
	*/
	this.deleteDraw = function(event){
		//删除
		if(action == 2){
			var dX = event.offsetX;
			var dY = event.offsetY;
			// console.log(dX,dY);
			var flag = false;

			for(var i=data.length-1; i>=0;i-- )
			{
				switch (data[i].shape){
				case 11 :
					// console.log("11");
					var tmpX = data[i].x.toString();
					var tmpY = data[i].y.toString();
					/*
						找到曲线保存的最上最下最左最右，在这之间的都删除
					*/
					var maxX = eval('Math.max('+ tmpX +')');
					var minX = eval('Math.min('+ tmpX +')');
					var maxY = eval('Math.max('+ tmpY +')');
					var minY = eval('Math.min('+ tmpY +')');
					// console.log(minX,maxX,minY,maxY);
					for(var j=0;j<tmpX.length; j++)
					{
						if(dX>=minX && dX<=maxX && dY>=minY && dY<=maxY)
						{
							//这就是要删除的
							data.splice(i,1);
							// console.log('delete');
							flag = true;
							break;
						}
					}
					break;
				case 12 :
					// console.log("12");
					var orignalX = data[i].orignalX;
					var orignalY = data[i].orignalY;
					var lastX = data[i].lastX;
					var lastY = data[i].lastY;
					if(orignalX>lastX)
					{
						var tmp = orignalX;
						orignalX = lastX;
						lastX = tmp;
					}
					if(orignalY>lastY)
					{
						var tmp = orignalY;
						orignalY = lastY;
						lastY = tmp;
					}
					if(dX>=orignalX && dX<= lastX && dY>=orignalY&& dY<=lastY)
					{
						data.splice(i,1);
						// console.log('delete');
						flag = true;
					}
					break;
				case 13 :
					// console.log("13");
					var tmp = data[i];
					// console.log(tmp.r,Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2)),tmp.r == Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2)));
					if(Math.floor(tmp.r) >= Math.floor(Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2))))
					{
						data.splice(i,1);
						// console.log('delete');
						flag = true;
					}
					break;
				case 14 :
					// console.log("14");
					var tmp = data[i];
					if(dX>=tmp.x&&dY>=tmp.y&&dX<=tmp.x+tmp.width&&dY<=tmp.y+tmp.height)
					{
						data.splice(i,1);
						// console.log('delete');
						flag = true;
					}
					break;
				case 15 :
					// console.log("15");
					var tmp = data[i];
					var l = Math.abs(dX - tmp.x);
					var h = Math.abs(dY - tmp.y);

					if(h<=tmp.b && l<=tmp.a)
					{
						data.splice(i,1);
						// console.log('delete');
						flag = true;
					}
					break;
				
				}
				
				
				if(flag){
					//刷新画布
					context.clearRect(0,0,width,height);
					_this.flushField();
					flag = false;
					break;
				}
				// console.log("flushField times");

			}
		}	
	}

	/**
	* 画曲线
	* @param oShape object 曲线对象
	*/
	_this.drawCurve = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

	    context.beginPath();
		context.moveTo(oShape.x[0],oShape.y[0]);
		for(var i in oShape.x){
			context.lineTo(oShape.x[i],oShape.y[i]);
			
		}
		context.stroke();
		context.beginPath();

		
	}

	/**
	* 画线
	* @param oShape object 线对象
	*/
	_this.drawLine = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.beginPath();
		context.moveTo(oShape.orignalX,oShape.orignalY);
		context.lineTo(oShape.lastX,oShape.lastY);
		context.closePath();
		context.stroke();
	}

	/**
	* 画圆
	* @param oShape object 圆对象
	*/
	_this.drawCircle = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.beginPath();
		context.arc(oShape.x,oShape.y,oShape.r,0,Math.PI * 2,true);
		context.stroke();
		context.closePath();
	}

	/**
	* 画矩形
	* @param oShape object 矩形对象
	*/
	_this.drawRectAngle = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.strokeRect(oShape.x, oShape.y, oShape.width, oShape.height);
	}

	/**
	* 画椭圆
	* @param oShape object 椭圆对象
	*/
	_this.drawEllipse = function(oShape){
		var ox = 0.5 * oShape.a,
	    	oy = 0.6 * oShape.b;

	    context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;
	    context.save();
	    context.translate(oShape.x, oShape.y);
	    context.beginPath();
	    //从椭圆纵轴下端开始逆时针方向绘制
	    context.moveTo(0, oShape.b); 
	    context.bezierCurveTo(ox, oShape.b, oShape.a, oy, oShape.a, 0);
	    context.bezierCurveTo(oShape.a, -oy, ox, -oShape.b, 0, -oShape.b);
	    context.bezierCurveTo(-ox, -oShape.b, -oShape.a, -oy, -oShape.a, 0);
	    context.bezierCurveTo(-oShape.a, oy, -ox, oShape.b, 0, oShape.b);
	    context.closePath();
	    context.stroke();
	    context.restore();
	}

	/**
	* 刷新重画
	*/
	_this.flushField = function(){
		//循环data数组来画
		
		context.clearRect(0,0,width,height);
		console.log('flushField!',data);
		for(var i=0;i<data.length; i++)
		{
			/*nowData = context.getImageData(0,0,width,height);
			context.clearRect(0,0,width,height);
			context.putImageData(nowData,0,0);*/
			switch (data[i].shape){
				case 11 :
					_this.drawCurve(data[i]);
					break;
				case 12 :
					_this.drawLine(data[i]);
					break;
				case 13 :  //画圆
					_this.drawCircle(data[i]);
					// console.log('draw circle '+i);
					break;
				case 14 :
					_this.drawRectAngle(data[i]);
					break;
				case 15 :
					_this.drawEllipse(data[i]);
					break;
			}
		}
	}

	/**
	* 在鼠标按下时处理
	*/
	this.initBeforeDraw = function(){
		if(event.button == 0 && action == 1){
			orignalX = event.offsetX;
			orignalY = event.offsetY;

			
			nowData = context.getImageData(0,0,width,height);
			

			
			context.beginPath();
			context.strokeStyle = color;
			context.lineWidth = lineWidth;
			isMouseDown = true;
		}
	}

	/**
	* 在鼠标移动时画
	*/
	this.moveDraw = function(){
		if(isMouseDown && action == 1){
			context.clearRect(0,0,width,height);
			context.putImageData(nowData,0,0);
			// _this.flushField();
			lastX = event.offsetX;
			lastY = event.offsetY;
			
			switch(shape){
				case 11 :
					context.lineTo(lastX,lastY);
					context.stroke();
					x.push(lastX);
					y.push(lastY);

					break;
				case 12 :
					var line = new Line(color,lineWidth,shape,orignalX,orignalY,lastX,lastY);
					_this.drawLine(line);
					break;
				case 13 :  //画圆
					var circle = new Circle(color,lineWidth,shape,orignalX+(lastX-orignalX)/2,orignalY+(lastY-orignalY)/2,Math.abs(lastX-orignalX+lastY-orignalY)/2);
					_this.drawCircle(circle);
					break;
				case 14 :
					var rectAngle = new RectAngle(color,lineWidth,shape,orignalX, orignalY, lastX-orignalX, lastY-orignalY);
					_this.drawRectAngle(rectAngle);
					break;
				case 15 :
					var eX = orignalX+(lastX-orignalX)/2;
					var eY = orignalY+(lastY-orignalY)/2;
					var a = Math.abs(lastX-eX);
					var b = Math.abs(lastY-eY);
					var ellipse = new Ellipse(color,lineWidth,shape,eX,eY,a,b);
					_this.drawEllipse(ellipse);
				    break;
			}
		}
		
	}

	/**
	* 在鼠标放开时处理程序
	*/
	this.afterDraw = function(){
		if(action == 1 && isMouseDown)
		{
			isMouseDown = false; //鼠标设置抬起状态
			context.closePath();

			switch(shape){
				case 11 :
					var curve = new Curve(color,lineWidth,shape,x,y);
					data.push(curve);
					break;
				case 12 :
					var line = new Line(color,lineWidth,shape,orignalX,orignalY,lastX,lastY);
					data.push(line);
					break;
				case 13 :  //画圆
					var circle = new Circle(color,lineWidth,shape,orignalX+(lastX-orignalX)/2,orignalY+(lastY-orignalY)/2,Math.abs(lastX-orignalX+lastY-orignalY)/2);
					data.push(circle);
					break;
				case 14 :
					var w = lastX-orignalX;
					var h =  lastY-orignalY;
					if(w<0)
					{
						w = Math.abs(w);
						var tmp;
						tmp = orignalX;
						orignalX = lastX;
						lastX = tmp;
					}
					if(h<0)
					{
						h = Math.abs(h);
						var tmp;
						tmp = orignalY;
						orignalY = lastY;
						lastY = tmp;
					}
					var rectAngle = new RectAngle(color,lineWidth,shape,orignalX, orignalY,w,h );
					data.push(rectAngle);
					break;
				case 15 :
					var eX = orignalX+(lastX-orignalX)/2;
					var eY = orignalY+(lastY-orignalY)/2;
					var a = Math.abs(lastX-eX);
					var b = Math.abs(lastY-eY);
					var ellipse = new Ellipse(color,lineWidth,shape,eX,eY,a,b);
					data.push(ellipse);
					break;
			}
			lastX = null;  
			lastY = null; //将最后坐标清空
			x = [];
			y = [];  //将画曲线的路径清空
		}
		
		// console.log(data);

	}
}

/**
* 控制器
* 接受View层的所有参数
* 调用Model来处理数据
*/
function CanvasController()
{
	this.canvas = new MyCanvas();
	var _this = this;
	var myCanvas = this.canvas.getMyCanvas();

	/**
	* 启动画板程序
	*/
	this.start = function(){
		myCanvas.addEventListener("mousedown", this.canvas.initBeforeDraw, false);
		myCanvas.addEventListener("mousemove", this.canvas.moveDraw, false);
		myCanvas.addEventListener("mouseup", this.canvas.afterDraw, false);
		myCanvas.addEventListener("mouseout", this.canvas.afterDraw, false);
		myCanvas.addEventListener("click", this.canvas.deleteDraw, false);
	}

	/**
	* 重画
	*/
	this.reDraw = function(){
		_this.canvas.reDraw();
	}

	/**
	* 撤销
	*/
	this.goBack = function(){
		_this.canvas.goBack();
	}

	/**
	* 展示保存的画布
	*/
	this.openCanvas = function(obj){
		_this.canvas.openCanvas(obj);
	}

	/**
	* 存画布
	*/
	this.saveCanvas = function(value){
		_this.canvas.saveCanvas(value);
	}

	/**
	* 打开一副画布
	*/
	this.openACanvas = function(value){
		console.log(value);
		_this.canvas.openACanvas(value);
	}
}

var canvasController = new CanvasController();
canvasController.start();  //启动画布程序



