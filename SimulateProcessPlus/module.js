
var module = (function(){
	var default_time_piece = []; //每个进程执行的时间片
	var default_priority = 0; //优先级数
	var default_block_time = 10;
	var is_start = 0; //是否开始演示
	var _create = []; //处于新建态的进程
	var _ready = []; //处于ready队列的进程,里面装的是列表
	var _block = []; //处于block队列的进程
	var _running = []; //处于running状态的进程
	var _exit = []; //退出态的进程
	var identifiers = []; //存不是退出态的所有进程的标识符identifiers_exit_running_block_ready_create
	var running_timer = null; //运行状态对象的定时器
	var block_timer = null; //堵塞态的定时器
	var create_timer = null; //创建态的定时器
	var tran = 1; //1为用户定制模式,0为自动模式
	/**
	* 进程控制块
	**/
	function PCB(priority,time){
		this.identifier  //标识符
		this.status = 1; //进程状态
		this.priority = priority;  //优先级
		this.block_time = 0; //如果进入阻塞队列,阻塞的时间
		if(tran == 1)
			this.time = time;  // to unannotation
		else
			this.time = Math.floor(1+ Math.random() * (default_time_piece[priority]*10)) ;  // to annotation
		this.time_piece = 0;
		this.times = 0;  //第多少个时间片
	}
	/**
	* 创建一个进程,加入_create队列
	* @param priority 优先级
	* @param time 进程总的运行时间
	*/
	var create = function(priority,time){
		
		if(tran == 1){
			if(!checker.is_number_with_0(priority,3) || priority>=default_priority){
				showMes('优先级错误!')
				return;
			}
			if(!checker.is_number(time,10)){
				showMes('运行时间设置错误!')
				return;
			}
			var pcb = new PCB(priority,time);   // to unannotation	
		}else
			var pcb = new PCB(getInteger(0,default_priority));  // to annotation
		//将创建的进程加入队列
		_create.push(pcb);
		showMes("创建了一个进程")
	}

	/**
	* 展示消息到控制台
	* @param mes 要展示的消息
	*/
	function showMes(mes){
		var date = new Date();
		operate.innerHTML += (date.getFullYear() + '-' + (date.getMonth()+1) +
						'-' + date.getDate() + ' ' + date.getHours() + 
						':' + date.getMinutes() + ':' + date.getSeconds() + 
						 ':' + mes + '\n'
			)
	}

	/**
	* 用来自动模式下的得到某个范围内的数字
	*/
	function getInteger(min,max){
		return Math.floor(Math.random()*max+min)
	}

	/**
	* 从_ready队列取出一个进程来运行
	*/
	var dispatch = function(){
		//先将_running的放到_ready队列
		if(_running.length != 0){
			var process = _running.shift();
			
			if(process.priority != (default_priority-1)){
				//将进程的优先级+1,时间片改变,放到下一个队列
				process.priority++;
				process.time_piece = default_time_piece[process.priority]
				_ready[process.priority].push(process);
				showMes('进程'+ process.identifier +'时间片用完进入ready态,队列变化:'+(process.priority-1)+'==>'+(process.priority));
			}else{
				_ready[process.priority].push(process);
				showMes('进程'+ process.identifier +'时间片用完进入ready态,队列变化:'+process.priority+'==>'+(process.priority));
			}
			
		}
		
		//从_ready队列取一个运行
		for(var key in _ready){
			//取的时候得考虑考虑
			if(_ready[key].length != 0){ //说明优先级高的还没运行完,先从这里挑选
				var process = _ready[key].shift();
				process.time_piece = default_time_piece[process.priority];
				process.times++
				_running.push(process);
				
				//console.log('shift:' + _running)
				showMes('分配了一个进程'+ process.identifier +'到running,此进程优先级为:'+(process.priority)+',第'+process.times+'个时间片');
				break
			}
		}
		
	}
	// 要输入的有: 优先级数目,每个优先级轮转的时间片
	function init(){
		priority = prompt('请输入优先级数目,eg:5')
		if(!checker.is_number(priority,3)){
			showMes('优先级数目错误!系统退出!')
			return 0;
		}
		default_priority = priority
		var tmp = 0; //每个优先级的轮转时间片
		for(var i=0; i<priority;i++){
			tmp = prompt('请输入'+i+'优先级的轮转时间片')
			if(!checker.is_number(tmp,3)){
				showMes('轮转时间片格式错误,请重新输入')
				i--
				continue
			}	
			//将时间片加入时间片队列
			default_time_piece[i] = tmp			
		}
		for(var i=0; i<default_priority;i++){
			_ready[i] = []
		}
		return 1;
	}

	/**
	*    优先级  1-10  越小优先级越高
	* s(83) : 开始演示
	* q(81) : 结束演示
	* c(67) : 往create队列添加一个进程 (新加的进程优先级默认为5)
	* b(66) : 将当前正在运行的进程阻塞  (默认阻塞10s)
	*/
	var getComment = function(key){
		var key = key == undefined ? event.keyCode : key;  //这个用来除键盘之外的控制
		// console.log(key)
		switch (key){
			case 83:  //开始演示
				if(is_start == 0) {  //如果是刚开始,新创建一个进程,并开始running
					is_start = 1;
					showMes('开始演示')
					//这个时候是要阻塞的
					if(!init()){
						return;
					}						

					// create();
					//启动管理器
					create_timer = setInterval(create_manager,1000);
					running_timer = setInterval(running_count_down,1000);
					block_timer = setInterval(block_count_down,1000);
					
				}
				break;
			case 84:
				if(tran == 1){
					tran =0
					showMes("从用户定制模式转换成自动模式")
				}else{
					tran = 1
					showMes("从自动模式转换成用户定制模式")
				}
					
				break;
			case 81:  //结束演示
				if(is_start == 1){
					window.location.href = window.location.href;
				}
				break;
			case 67:  //往_create队列添加一个进程 (新加的进程优先级默认为5)
				if(is_start == 1){
					//显示信息框
					if(tran == 1){
						operater.show_box()  // to unannotation
						document.getElementById('td_priority').innerHTML = '优先级(0-'+(default_priority-1)+'):' // to unannotation	
					}else
						create()    // to annotation
					}
				break;
			case 66: //将当前正在运行的进程阻塞  (默认阻塞10s)
				if(_running.length != 0){
					if(tran == 1){
						operater.show_bk_box() // to unannotation
					}else
						block_it() // to annotation
				}

				break;	
			case 69:  //将当前进程异常退出
				if(_running.length != 0){
					var process = _running.shift();
					process.status = 0;
					_exit.push(process);
					showMes('进程: ' + process.identifier + '异常退出');
				}

			break;
		}
	}
	/**
	* 阻塞当前运行进程
	* @param time 阻塞的时间(单位:s)
	*/
	function block_it(time){
		var process = _running.shift();
		if(tran == 1)
			process.block_time = time; // to unannotation
		else
			process.block_time = default_block_time; // to annotation
		// 
		
		_block.push(process);
		showMes('阻塞了一个优先级为'+(process.priority)+'的进程: ' + process.identifier);
	}

	/**
	* 处理新建态的进程
	*/
	function create_manager(){
		if(_create.length != 0){
			//从新建队列头处理标识符,然后加入_ready队列
			var identifier = Math.floor(300+Math.random() * 32468); // 300 - 32767
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
				//说明没有相同标识符,分配标识符,加入_ready队列,根据优先级来加
				var process = _create.shift();
				// console.log(_create)
				identifiers.push(identifier);  //将标识符加入到总的标识符集合中
				process.identifier = identifier;
				// console.log(process.priority)

				_ready[process.priority].push(process);
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
			// console.log(_running)
			if(_running[0].time <= 0){
				//进程应该加入退出态
				var process = _running.pop();
				process.status = 0;
				_exit.push(process);
				showMes('进程' + process.identifier + '进入退出态' )
				
				return;
			}

			if(_running[0].time_piece == 0){
				// clearInterval(running_timer);  //没必要清空
				// _ready.push(_running.shift()); //dispatch里面会处理
				dispatch(); //重新分配进行去运行
				//
				return;
			}
		}else{
			dispatch(); //如果没有在运行的,则挑选进程来运行
		}
		
	}
	
	/**
	* 改变block队列的进程的block剩余时间
	**/
	function block_count_down(){
		if(_block.length != 0){
			//如果阻塞队列不空,循环将阻塞队列的阻塞剩余时间-1
			for(var i in _block){
				if(--_block[i].block_time == 0){
					//如果阻塞时间到了,将其摘到_ready队列
					var process = _block[i];
					_block.splice(i,1); //将进程摘出来
					//阻塞的进程应该是回到阻塞时对应优先级的队列
					_ready[process.priority].push(process);
					showMes('进程'+ process.identifier + '阻塞事件完毕,进入ready态,优先级为:'+(process.priority))
				}
			}
		}
	}
	function get_priority(){
		return default_priority
	}

	return {
		_create:_create,
		_ready:_ready,
		_block:_block,
		_running:_running,
		_exit:_exit,
		create:create,
		get_priority:get_priority,
		block_it:block_it,
		getComment:getComment,
	}
})()


var checker = (function(){
	/**
	* 检验number是否是小于等于len的数字,首位不能为0
	*/
	function is_number(number,len) {
			var re = '^[1-9][0-9]{0,'+len+'}$'
			var patt = new RegExp(re)
			return patt.test(number)
	}
	/**
	* 检验number是否是小于等于len的数字
	*/
	function is_number_with_0(number,len) {
			var re = '^[0-9]{0,'+len+'}$'
			var patt = new RegExp(re)
			return patt.test(number)
	}


	return {
		is_number:is_number,
		is_number_with_0:is_number_with_0,
	}
})()

var operater = (function(){
	var obj = document.getElementById('mes_box')
	var bk_obj = document.getElementById('block_box')
	/**
	* 取消创建进程的自定义框,隐藏
	*/
	function cancel(){
		obj.style.display = 'none'
	}
	/**
	* 展示创建进程的自定义框
	*/
	function show_box(){
		obj.style.display = 'block'	
	}
	/**
	* 取消阻塞进程的自定义框,隐藏
	*/
	function bk_cancel(){
		bk_obj.style.display = 'none'
	}
	/**
	* 展示阻塞进程的自定义框
	*/
	function show_bk_box(){
		bk_obj.style.display = 'block'
	}

	return {
		cancel:cancel,
		show_box:show_box,
		bk_cancel:bk_cancel,
		show_bk_box,show_bk_box,
	}
})()
