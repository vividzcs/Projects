function Shape(color='#000',lineWidth=1,shape)
{
    this.color = color;  //线的颜色
    this.lineWidth = lineWidth;  //画线的宽度 
    this.shape = shape;  
}

function Curve(color,lineWidth,shape,x,y)
{
    Shape.call(this,color,lineWidth,shape);
    this.x = x;
    this.y = y;
}

function Line(color,lineWidth,shape,orignalX,orignalY,lastX,lastY)
{
	Shape.call(this,color,lineWidth,shape);
	this.orignalX = orignalX;
	this.orignalY = orignalY;  //起始的位置
	this.lastX = lastX;
	this.lastY = lastY; //结束的位置
}

function Circle(color,lineWidth,shape,x,y,r)
{
	Shape.call(this,color,lineWidth,shape);
	this.x = x;
	this.y = y;  //圆心
	this.r = r; //半径
}

function Ellipse(color,lineWidth,shape,x,y,a,b)
{
	Shape.call(this,color,lineWidth,shape);
	this.x = x;
	this.y = y;  //圆心
	this.a = a; //
	this.b = b; //
}

function RectAngle(color,lineWidth,shape,x,y,width,height)
{
	Shape.call(this,color,lineWidth,shape);
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
	var lineWidth = 1;  //画线的宽度
	var orignalX,orignalY;  //起始的位置
	var lastX,lastY; //结束的位置
	var width = myCanvas.width ,height = myCanvas.height;
	var data = [];  //用来保存形状
	var nowData;
	var isMouseDown = false;
	var x = [],y = [];
	
	this.getMyCanvas = function(){
		return myCanvas;
	}
	this.getContext = function(){
		return context;
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
		lineWidth = parseInt(oWidth);
		console.log(typeof lineWidth);
	}

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
		console.log(localStorage[fileName]);
	}

	this.openCanvas = function(openLi){
		var str = '打开<ul class="sublist">';//;
		for(var i in localStorage)
		{
			str += '<li onclick="canvasController.canvas.openACanvas(this.innerHTML)">'+i+'</li>';
		}
		str +='<li onclick="localStorage.clear();" style="color:red;text-align:center">清空</li></ul>';
		openLi.innerHTML =str;
	}

	this.openACanvas = function(fileName){
		console.log('click');
		data = [];
		data = eval(localStorage[fileName]);
		console.log(data);
		//刷新画布
		_this.flushField();
	}

	this.reDraw = function(){
		context.clearRect(0,0,width,height);
		data = [];
	}

	this.goBack = function(){
		data.pop();
		_this.flushField();
	}

	this.deleteDraw = function(event){
		//删除
		if(action == 2){
			var dX = event.offsetX;
			var dY = event.offsetY;
			console.log(dX,dY);
			var flag = false;

			for(var i=data.length-1; i>=0;i-- )
			{
				switch (data[i].shape){
				case 11 :
					console.log("11");
					var tmpX = data[i].x.toString();
					var tmpY = data[i].y.toString();
					var maxX = eval('Math.max('+ tmpX +')');
					var minX = eval('Math.min('+ tmpX +')');
					var maxY = eval('Math.max('+ tmpY +')');
					var minY = eval('Math.min('+ tmpY +')');
					console.log(minX,maxX,minY,maxY);
					for(var j=0;j<tmpX.length; j++)
					{
						if(dX>=minX && dX<=maxX && dY>=minY && dY<=maxY)
						{
							//这就是要删除的
							data.splice(i,1);
							console.log('delete');
							flag = true;
							break;
						}
					}
					break;
				case 12 :
					console.log("12");
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
						console.log('delete');
						flag = true;
					}
					break;
				case 13 :
					console.log("13");
					var tmp = data[i];
					console.log(tmp.r,Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2)),tmp.r == Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2)));
					if(Math.floor(tmp.r) >= Math.floor(Math.sqrt(Math.pow((tmp.x-dX),2)+Math.pow((tmp.y-dY),2))))
					{
						data.splice(i,1);
						console.log('delete');
						flag = true;
					}
					break;
				case 14 :
					console.log("14");
					var tmp = data[i];
					if(dX>=tmp.x&&dY>=tmp.y&&dX<=tmp.x+tmp.width&&dY<=tmp.y+tmp.height)
					{
						data.splice(i,1);
						console.log('delete');
						flag = true;
					}
					break;
				case 15 :
					console.log("15");
					var tmp = data[i];
					var l = Math.abs(dX - tmp.x);
					var h = Math.abs(dY - tmp.y);

					if(h<=tmp.b && l<=tmp.a)
					{
						data.splice(i,1);
						console.log('delete');
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
				console.log("flushField times");

			}
		}	
	}

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

	_this.drawLine = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.beginPath();
		context.moveTo(oShape.orignalX,oShape.orignalY);
		context.lineTo(oShape.lastX,oShape.lastY);
		context.closePath();
		context.stroke();
	}


	_this.drawCircle = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.beginPath();
		context.arc(oShape.x,oShape.y,oShape.r,0,Math.PI * 2,true);
		context.stroke();
		context.closePath();
	}

	_this.drawRectAngle = function(oShape){
		context.strokeStyle = oShape.color;
	    context.lineWidth = oShape.lineWidth;

		context.strokeRect(oShape.x, oShape.y, oShape.width, oShape.height);
	}

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

	_this.flushField = function(){
		//循环data数组来画
		
		context.clearRect(0,0,width,height);
		console.log('flushField!',data.length);
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
					console.log('draw circle '+i);
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
					context.beginPath();
					context.moveTo(orignalX,orignalY);
					context.lineTo(lastX,lastY);
					context.stroke();
					context.closePath();
					
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

	this.afterDraw = function(){
		if(action == 1 && isMouseDown)
		{
			isMouseDown = false;
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
			lastY = null;
			x = [];
			y = [];
		}
		
		console.log(data);

	}
}

function CanvasController()
{
	this.canvas = new MyCanvas();
	var _this = this;
	var myCanvas = this.canvas.getMyCanvas();
	this.start = function(){
		myCanvas.addEventListener("mousedown", this.canvas.initBeforeDraw, false);
		myCanvas.addEventListener("mousemove", this.canvas.moveDraw, false);
		myCanvas.addEventListener("mouseup", this.canvas.afterDraw, false);
		myCanvas.addEventListener("mouseout", this.canvas.afterDraw, false);
		myCanvas.addEventListener("click", this.canvas.deleteDraw, false);
	}

	this.reDraw = function(){
		_this.canvas.reDraw();
	}

	this.goBack = function(){
		_this.canvas.goBack();
	}

	this.openCanvas = function(obj){
		_this.canvas.openCanvas(obj);
	}
	this.saveCanvas = function(value){
		_this.canvas.saveCanvas(value);
	}
}

var canvasController = new CanvasController();
canvasController.start();



