
var module = (function(){
	const default_time_piece = 5; //每个进程执行的时间片
	const default_priority = 5; //默认优先级
	const default_block_time = 10;
	var is_start = 0; //是否开始演示
	var _create = []; //处于新建态的进程
	var _ready = []; //处于ready队列的进程
	var _block = []; //处于block队列的进程
	var _running = []; //处于running状态的进程
	var _exit = []; //退出态的进程
	var identifiers = []; //存不是退出态的所有进程的标识符
	var running_timer = null; //运行状态对象的定时器
	var block_timer = null; //堵塞态的定时器
	var create_timer = null; //创建态的定时器
	/**
	* 进程控制块
	**/
	function PCB(priority){
		this.identifier  //标识符
		this.status = 1; //进程状态
		this.priority = priority;  //优先级
		this.block_time = 0; //如果进入阻塞队列,阻塞的时间
		this.time = Math.floor(1+ Math.random() * 50) ;  //[1-51)s
		this.time_piece = 0;
	}
	/**
	* 创建一个进程,加入_ready队列
	*
	*/
	var create = function(){
		var pcb = new PCB(default_priority,default_time_piece);
		//将创建的进程加入队列
		_create.push(pcb);
		operate.innerHTML = "创建了一个进程"
	}

	/**
	* 从_ready队列取出一个进程来运行
	*/
	var dispatch = function(){
		//先将_running的放到_ready队列
		if(_running.length != 0){
			_ready.push(_running.shift());
		}
		
		//从_ready队列取一个运行
		if(_ready.length != 0){
			var process = _ready.shift();
			process.time_piece = default_time_piece;
			_running.push(process);
			//console.log('shift:' + _running)
			operate.innerHTML = "分配了一个进程到running: " + process.identifier;
		}
		
	}

	/**
	*    优先级  1-10  越小优先级越高
	* s(83) : 开始演示
	* q(81) : 结束演示
	* c(67) : 往ready队列添加一个进程 (新加的进程优先级默认为5)
	* b(66) : 将当前正在运行的进程阻塞  (默认阻塞10s)
	*/
	var getComment = function(key){
		var key = key == undefined ? event.keyCode : key;  //这个用来除键盘之外的控制
		// console.log(key)
		switch (key){
			case 83:  //开始演示
				if(is_start == 0) {  //如果是刚开始,新创建一个进程,并开始running
						is_start = 1;
						create();
						//启动管理器
						create_timer = setInterval(create_manager,1000);
						running_timer = setInterval(running_count_down,1000);
						block_timer = setInterval(block_count_down,1000);
				}
				break;
			case 81:  //结束演示
				window.location.href = window.location.href;
				break;
			case 67:  //往_create队列添加一个进程 (新加的进程优先级默认为5)
				var pcb = new PCB(default_priority);
				_create.push(pcb)
				break;
			case 66:  //将当前正在运行的进程阻塞  (默认阻塞10s)
				var process = _running.shift();
				process.block_time = default_block_time;
				_block.push(process);
				operate.innerHTML = '阻塞了一个进程: ' + process.identifier;

				break;
		}
	}
	/**
	* 处理新建态的进程
	*/
	function create_manager(){
		if(_create.length != 0){
			//从新建队列头处理标识符,然后加入_ready队列
			var identifier = Math.floor(1+Math.random() * 1024);
			var flag = 0;
			for(var i in identifiers){
				if(identifier == identifiers[i]){
					flag = 1;
					break;
				}
			}

			if(flag){
				//说明有相同标识符
				create_manager();
			}else{
				//说明没有相同标识符,分配标识符,加入_ready队列
				var process = _create.shift();
				// console.log(_create)
				identifiers.push(identifier);  //将标识符加入到总的标识符集合中
				process.identifier = identifier;
				_ready.push(process);
			}
		}
		
	}
	/**
	* 改变当前running状态的剩余时间
	* 将一个进程进入running状态,他将得到一个time_piece,
	* 时间片不断减少,进程整个的运行时间也在减少
	* 当当前运行剩余时间为0,当前进程进入_ready队列
	* 新挑选进程进入_running状态
	* 如果阻塞(按下b),当前进程进入阻塞状态
	*
	**/
	function running_count_down(){
		if(_running.length != 0){
			//运行时间-1,生命周期-1
			_running[0].time--;
			_running[0].time_piece--;
			console.log(_running[0].time)
			if(_running[0].time <= 0){
				//进程应该加入退出态
				var process = _running.pop();
				process.status = 0;
				_exit.push(process);
				
				return;
			}

			if(_running[0].time_piece == 0){
				// clearInterval(running_timer);  //没必要清空
				_ready.push(_running.shift());
				dispatch(); //重新分配进行去运行
				//
				return;
			}
		}else{
			dispatch();
		}
		
	}
	
	/**
	* 改变block队列的进程的block剩余时间
	**/
	function block_count_down(pcb){
		if(_block.length != 0){
			//如果阻塞队列不空,循环将阻塞队列的阻塞剩余时间-1
			for(var i in _block){
				if(--_block[i].block_time == 0){
					//如果阻塞时间到了,将其摘到_ready队列
					var process = _block[i];
					_block.splice(i,1);
					_ready.push(process);
				}
			}
		}
	}

	return {
		_create:_create,
		_ready:_ready,
		_block:_block,
		_running:_running,
		_exit:_exit,
		create:create,
		dispatch:dispatch,
		getComment:getComment
	};

})()


/*
遇到的问题:
1. var _running 在外面读不到




*/