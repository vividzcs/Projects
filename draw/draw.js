function Shape(color='#000',strokeWidth=1,shape)
{
    this.color = color;  //线的颜色
    this.strokeWidth = strokeWidth;  //画线的宽度 
    this.shape = shape;  
}

function Curve(color,strokeWidth,shape,x,y)
{
    Shape.call(this,color,strokeWidth,shape);
    this.x = x;
    this.y = y;
}

function Line(color,strokeWidth,shape,orignalX,orignalY,lastX,lastY)
{
	Shape.call(this,color,strokeWidth,shape);
	this.orignalX = orignalX;
	this.orignalY = orignalY;  //起始的位置
	this.lastX = lastX;
	this.lastY = lastY; //结束的位置
}

function Circle(color,strokeWidth,shape,x,y,r)
{
	Shape.call(this,color,strokeWidth,shape);
	this.x = x;
	this.y = y;  //圆心
	this.r = r; //半径
}

function RectAngle(color,strokeWidth,shape,x,y,width,height)
{
	Shape.call(this,color,strokeWidth,shape);
	this.x = x;
	this.y = y;  //左上角的位置
	this.width = width;  //宽
	this.height = height;  //高
}

function MyCanvas()
{
	var _this = this;
	var myCanvas = document.getElementById("myCanvas");;
	var context = myCanvas.getContext('2d');;
	var action = 1;  //动作，1是画图,2是橡皮擦
	var shape = 11;  //画的形状
	var color = '#000';  //线的颜色
	var strokeWidth = 1;  //画线的宽度
	var orignalX,orignalY;  //起始的位置
	var lastX,lastY; //结束的位置
	var width = myCanvas.width ,height = myCanvas.height;
	var data = [];  //用来保存形状
	var nowData;
	var isMouseDown = false;
	var x = [],y = [];
	
	this.getMyCanvas = function(){
		// context.globalCompositeOperation="lighter";
		return myCanvas;
	}
	this.setAction = function(oAction){
		console.log('set action '+ oAction);
		action = oAction;
	}
	this.setShape = function(oShape){
		console.log(shape);
		shape = oShape;
		console.log(shape);
	}
	this.setColor = function(oColor){
		color = oColor;
	}

	this.setStrokeWidth = function(oWidth){
		strokeWidth = oWidth;
	}

	this.saveCanvas = function(){
		
	}
	
	this.deleteDraw = function(){
		//删除
		if(action == 2){
			for(var i in data)
			{
				var con = data[i].getContext('2d');
				if(con.isPointInPath(orignalX,orignalY))
				{
					// alert('delete');
					delete data[i];
					break;
				}
					
			}
		}
		
	}

	_this.drawCurve = function(oShape){
		context.clearRect(0,0,width,height);
		context.putImageData(nowData,0,0);

		for(var i in oShape.x){
			context.lineTo(oShape.x[i],oShape.y[i]);
			context.stroke();
		}
		context.closePath();
		
	}

	_this.drawLine = function(oShape){
		context.clearRect(0,0,width,height);
		context.putImageData(nowData,0,0);

		context.beginPath();
		context.moveTo(oShape.orignalX,oShape.orignalY);
		context.lineTo(oShape.lastX,oShape.lastY);
		context.closePath();
		context.stroke();
	}

	_this.drawCircle = function(oShape){
		context.clearRect(0,0,width,height);
		context.putImageData(nowData,0,0);

		context.beginPath();
		context.arc(oShape.x,oShape.y,oShape.r,0,Math.PI * 2,true);
		context.stroke();
		context.closePath();
	}

	_this.drawRectAngle = function(oShape){
		context.clearRect(0,0,width,height);
		context.putImageData(nowData,0,0);

		context.strokeRect(oShape.x, oShape.y, oShape.width, oShape.height);
	}

	_this.flushField = function(){
		//循环data数组来画
		for(var i in data)
		{
			switch (data[i].shape){
				case 11 :
					context.beginPath();
					_this.drawCurve(data[i]);
					context.closePath();
					break;
				case 12 :
					_this.drawLine(data[i]);
					break;
				case 13 :  //画圆
					_this.drawCircle(data[i]);
					break;
				case 14 :
					_this.drawRectAngle(data[i]);
					break;
			}
		}
	}

	this.initBeforeDraw = function(){
		if(event.button == 0 && action == 1){
			orignalX = event.offsetX;
			orignalY = event.offsetY;
			//刷新画布
			context.clearRect(0,0,width,height);
			context.beginPath();
			nowData = context.getImageData(0,0,width,height);
			_this.flushField();

			
			context.beginPath();
			
			context.strokeStyle = color;
			context.lineWidth = strokeWidth;
			isMouseDown = true;
		}
	}

	this.moveDraw = function(){
		if(isMouseDown && action == 1){
			context.clearRect(0,0,width,height);
			context.putImageData(nowData,0,0);
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
					var line = new Line(color,strokeWidth,shape,orignalX,orignalY,lastX,lastY);
					_this.drawLine(line);
					break;
				case 13 :  //画圆
					var circle = new Circle(color,strokeWidth,shape,orignalX+(lastX-orignalX)/2,orignalY+(lastY-orignalY)/2,Math.abs(lastX-orignalX+lastY-orignalY)/2);
					_this.drawCircle(circle);
					break;
				case 14 :
					var rectAngle = new RectAngle(color,strokeWidth,shape,orignalX, orignalY, lastX-orignalX, lastY-orignalY);
					_this.drawRectAngle(rectAngle);
					break;
			}
		}
		
	}

	this.afterDraw = function(){
		if(action == 1)
		{
			isMouseDown = false;
			lastX = null;
			lastY = null;
			context.closePath();

			switch(shape){
				case 11 :
					var curve = new Curve(color,strokeWidth,shape,x,y);
					data.push(curve);
					break;
				case 12 :
					var line = new Line(color,strokeWidth,shape,orignalX,orignalY,lastX,lastY);
					data.push(line);
					break;
				case 13 :  //画圆
					var circle = new Circle(color,strokeWidth,shape,orignalX+(lastX-orignalX)/2,orignalY+(lastY-orignalY)/2,Math.abs(lastX-orignalX+lastY-orignalY)/2);
					data.push(circle);
					break;
				case 14 :
					var rectAngle = new RectAngle(color,strokeWidth,shape,orignalX, orignalY, lastX-orignalX, lastY-orignalY);
					data.push(rectAngle);
					break;
			}
		}
		
		console.log(data);

	}
}

function CanvasController()
{
	this.canvas = new MyCanvas();
	var myCanvas = this.canvas.getMyCanvas();
	this.start = function(){
		myCanvas.addEventListener("mousedown", this.canvas.initBeforeDraw, false);
		myCanvas.addEventListener("mousemove", this.canvas.moveDraw, false);
		myCanvas.addEventListener("mouseup", this.canvas.afterDraw, false);
		myCanvas.addEventListener("click", this.canvas.deleteDraw, false);
	}
}

var canvasController = new CanvasController();
canvasController.start();



