;var module = (function(){
    "use strict";
    
    var is_start = 0;
    var s_index = 0;
    var p_index = 0;
    var page_index = 0;
    var processes = [];
    var segments = [];
    var pages = [];
    var page_size = 1024;
    var resident_size = 4; //驻留集大小默认为8
    var segment_num = 0;  //段数目
    var memory_size = 0; //内存大小
    var is_fifo = true;
    var has_used = 0; //已经用了内存大小的多少

    /**
    * 根据前面分配的段得到段基址
    */
    function getBase(){
        var base = 0;
        for(var i in segments){
            base += segments[i].length;
        }
        return base;
    }

    /**
    * 手工输入某进程的内存申请（哪几个段、各段多大？）
    * 根据输入的段的大小来确定需要分配多少页
    * @param s_id int 段号
    * @param length 需要申请的页数目
    */
    function getPages(length){
        var pages = [];
        for(var i=0; i<length;i++){
            pages.push(new Page());
        }

        return pages;
    }

    /**
    * 生成随机数
    * @param min int 最小值
    * @param max int 最大值
    */
    function getRandom(min,max){
        return min + Math.floor(1 + (Math.random() * max))
    }
    /**
    * Process
    * @param pcb_id int 进程id
    * @param page_num int 页数量
    * @param segments array 进程所在的段号
    */
    function PCB(pcb_id,page_num,segments){
        this.pcb_id = pcb_id;
        this.page_num = page_num; // 页数量
        this.segments = segments;  //进程所使用的段
        this.resident = []; //驻留集
    }
    /**
    * 段
    * @param length int 段大小
    */
    function Segment(length){
        this.s_id = s_index++;
        this.length = length; //段大小
        this.base = getBase();  //基地址
        this.pages = getPages(); //这一个段所属的页
        this.is_changed = false; //是否改变
        this.is_using = false;
    }
    /*
    * 页
    * @param p_id int 页id
    * @param frame_id int 页框id
    * @param s_id int 段id
    *
    */
    function Page(p_id,frame_id,s_id){
        this.p_id = p_id;
        this.frame_id = frame_id; //页框id
        this.s_id = s_id; //段id
        this.pcb_id = -1; //进程id
        this.is_changed = false; //是否已改变
        this.is_using = false; //是否正在使用
        this.use_time = 0;  //访问时的时间戳,会更新
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
    * 验证是否是数字
    * @param number int 传入的数字
    * @param len int 可选 数字的长度
    */
    function is_number(number,len) {
        var len = len || '';
        var re = '^[1-9][0-9]{0,'+len+'}$'
        var patt = new RegExp(re)
        return patt.test(number)
    }

    /**
    * 检验number是否是小于等于len的数字
    */
    function is_number_with_0(number,len) {
            var len = len || '';
            var re = '^[0-9]{0,'+len+'}$'
            var patt = new RegExp(re)
            return patt.test(number)
    }

    /**
    * string转int 因为数据都是经过转换的,所以不用检验
    */
    function get_integer(string){
        return parseInt(string);
    }

    // 要输入的有: 内存总大小和段的数目
    //              每个段的大小
    function init(){
        var size = prompt('请输入内存总大小,单位为k,eg:64')
        if(!is_number(size)){
            showMes('内存总大小格式错误!系统退出!')
            return 0;
        }
        memory_size = get_integer(size);
        size = prompt('请输入段的数目,eg:5')
        if(!is_number(size)){
            showMes('段数目格式错误!系统退出!')
            return 0;
        }
        segment_num = get_integer(size);
        var tmp = 0; //每个段的大小
        var sum = 0;
        for(var i=0; i<segment_num;i++){
            tmp = prompt('请输入'+i+'号段的大小,单位为k,e.g:10')
            if(!is_number(tmp)){
                showMes('段大小格式错误,请重新输入')
                i--
                continue
            }   
            //初始化段到segments
            tmp = get_integer(tmp);
            sum += tmp;
            var segment = new Segment(tmp);
            for(var j=0;j<tmp;j++){
                var page = new Page(j,page_index++,s_index-1) //function Page(p_id,frame_id,s_id)
                segment.pages.push(page)
                pages.push(page)
            }
            segments.push(segment);
        }
        if(sum != memory_size){
            showMes('段大小和与内存总大小不相等!系统退出!')
            return 0;
        }

        
        return 1;
    }

    /**
    * 创建一个进程
    * 需要用户输入的有:
    * 需要的段数
    * 哪几个段,各段多大
    */
    function create(s_numner,s_ids,s_sizes){
        // console.log(s_numner,s_ids,s_sizes)
        var ids = s_ids.split(",");
        var sizes = s_sizes.split(",");
        // console.log(ids,sizes)
        if(!is_number(s_numner) || ids.length != sizes.length){
            showMes("进程信息输入格式有误,请重新输入1");//段数不是数字或进程段号和对应段大小不相等
            return;
        }
        var sum = 0;
        for(var i=0;i<ids.length;i++){
            // console.log(ids[i],sizes[i],is_number_with_0(ids[i]),is_number(sizes[i]))
            if(!is_number_with_0(ids[i])||!is_number(sizes[i])){
                showMes("进程信息输入格式有误,请重新输入2");//进程段号和对应段大小不是数字
                return;       
            }
            ids[i] = get_integer(ids[i]);
            sizes[i] = get_integer(sizes[i]);
            if(ids[i]>=segment_num || sizes[i]>segments[ids[i]].length){
                showMes("进程信息输入格式有误,请重新输入3");//段号不在段id里面
                return;
            }
            // 开始在每个段分配页给进程, 暂时分前驻留集个页大小
            ids[i] = segments[ids[i]];

            sum += sizes[i]; //得到进程需要的内存总大小(所需段的总大小,page_num)
        }
        // TODO:判断所剩内存是否够,不过不够将不会创建

        // console.log(s_numner,s_ids,s_sizes)

        //开始创建  function PCB(pcb_id,page_num,segments)
        var pcb = new PCB(p_index++,sum,ids);
        // console.log(pcb)
        // var count = 0; //用来标志如果已经扫描一圈还未发现有空闲页,则进程不会创建
        // var page_count = 0; //已分配个数
        // for (var i = 0; i < ids.length; i++) {
        //     var min = resident > sizes[i] ? sizes[i] : resident; //需要分配给进程的页
        //     for(var i=0;i<min;i++){
        //         while(page_count < min && count < ids[i].length){
        //             var page = segments[ids[i]].pages[count++]    
        //             if(page.is_using){
        //                 continue;
        //             }else{
        //                 //选中这个页给进程
        //                 pcb.resident.push(page);
        //                 page.is_using = true;
        //                 page_count++;
        //             }

        //         }
        //         //
        //         if(count >= ids[i].length){
        //             showMes(ids[i]+"段内存不足,进程创建失败");
        //             return;
        //         }
                
        //     }
        // }
        processes.push(pcb);
        showMes('创建一个进程:'+pcb.pcb_id)
    }

    /**
    *    接收用户键盘指令
    * s(83) : 开始模拟
    * q(81) : 结束演示
    * c(67) : 创建进程
    * 
    */
    var getCommand = function(key){
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
                }
                break;
             
            case 81:
                if(is_start){
                    window.location.href = window.location.href;
                }
                break;
            case 67://创建一个进程
                if(is_start){
                    operater.show_bk_box();
                }

                break;  
            case 70://转换替换策略
                if(is_start){
                    if(is_fifo){
                        is_fifo = false;
                        showMes("FIFO====>LRU")
                    }
                    else{
                        is_fifo = true;
                        showMes("LRU====>FIFO")
                    }
                }

                break;  
            case 77:
                if(is_start){
                    operater.show_box();
                }
                break;
        } 
    }

    /**
    * 释放掉一个进程的所有页
    */
    function deallocate(process){
        for(var i in process.resident){
            var page = process.resident.pop();
            page.is_using = false;
            has_used--;
        }
        delete processes[process.pcb_id];
    }

    /**
    * 找出最久未使用的,即时间戳最小的
    */
    function lru(process){
        var page = process.resident[0];
        var tmp;
        var k = 0;
        for(var i=0; i<process.resident.length;i++){
            tmp = process.resident[i];
            if(tmp.use_time < page.use_time){
                page = tmp;
                k = i;
            }
        }
        showMes("驻留集已满:执行LRU策略 段("+process.resident[k].s_id+') 页('+process.resident[k].p_id+') 被替换');
        page = process.resident.splice(k,1);
        page[0].is_using = false;

    }

    /**
    * 检查pcb_id的合法性
    */
    function check_pcb_id(pcb_id){
        var flag = false;
        for(var i in processes){
            if(processes[i].pcb_id == pcb_id){
                flag = true;
            }
        }
        return flag;
    }

    /**
    * 地址映射
    * @param p_id int 进程号
    * @param s_id int 段号
    * @param address int 地址
    */
    function mapping(pcb_id,s_id,address){
        if(!check_pcb_id(pcb_id)) {
            showMes("PID错误");
            return;
        }
        var p_id = Math.floor(address/page_size);
        var offset = address % page_size;
        var process = processes[pcb_id];
        var date = new Date();
        //对输入值进行验证
        if(process.resident.length > process.page_num || address > (segments[s_id].length * page_size)){
            showMes("地址非法");
            return;
        }
        //先判断进程是否退出
        if(process == undefined){
            showMes("进程不存在请重新输入");
            return;
        }
        if(process.resident.length == 0){
            showMes("此段未内容未载入内存,执行缺段中断!")
            segments[s_id].is_using = true;
        }
        // console.log(p_id,offset)
        var page = segments[s_id].pages[p_id];
        if(!page.is_using){ //此页未内容未载入内存
            showMes("此页未内容未载入内存,执行缺页中断!");
            if(has_used >= memory_size){
                //内存不足
                showMes("内存不足,进程退出");
                deallocate(process);
                return;
            }
            //载入内存,判断驻留集是否已满
            if(process.resident.length<resident_size){
                //未满
               page.is_using = true;
               page.use_time = date.getTime();
               page.pcb_id = process.pcb_id;
               has_used++;
               process.resident.push(page); 
            }else{
                //驻留集已满
                if(is_fifo){//FIFO
                    var p = process.resident.splice(0,1);
                    // console.log(p)
                    p[0].is_using = false;
                    page.is_using = true;
                    page.use_time = date.getTime();
                    page.pcb_id = process.pcb_id;
                    has_used++;
                    process.resident.push(page); 
                    showMes("驻留集已满:执行FIFO策略 段("+p[0].s_id+') 页('+p[0].p_id+') 被替换');
                }else{ //LRU
                    lru(process);
                    page.is_using = true;
                    page.use_time = date.getTime();
                    page.pcb_id = process.pcb_id;
                    has_used++;
                    process.resident.push(page); 
                }
            }
            
        }else{// 已载入内存,判断地址是否被其他进程占用
            if(page.pcb_id != pcb_id){
                showMes("地址非法,已被占用")
                return;    
            }
            page.use_time = date.getTime();
        }
        var segment = segments[s_id];
        var addr = segment.s_id*segment.length +page.frame_id*page.p_id + offset; 
            showMes("物理地址: "+addr);
        
    }

    /**
    *m得到驻留集大小
    */
    function get_resident_size(){
        return resident_size;
    }

    return {
        getCommand:getCommand,
        create,create,
        mapping,mapping,
        segments:segments,
        processes,processes,
        get_resident_size,get_resident_size,
    };
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