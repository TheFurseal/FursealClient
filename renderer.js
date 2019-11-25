// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

document.write("<script language='javascript' src='./echarts.min.js'></script>")
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "./css/style.css";
document.getElementsByTagName("head")[0].appendChild(link);

var ipcManager = window.ipcManager

var pageLocation;
var listLocation;


function constructList(parent,data){
    var dataTmp = data;
    var key = data.key;
    data = data.value;
    if(typeof(data) == 'string'){
        data = JSON.parse(data);
    }
    //see if element was already exists.
    var wrapper = document.getElementById('taskListBar_'+key);
    if(wrapper == null){ // just add new one
        console.log('Add new nodes to DOM')
        wrapper = document.createElement('div');
        wrapper.className = 'taskListBar';
        wrapper.id = 'taskListBar_'+key;
        parent.appendChild(wrapper);
        wrapper.onclick = function(){
            if(listLocation != null){
                var tmp = document.getElementById('listDetail_'+listLocation);
                // tmp.style.opacity = '0';
                if(tmp != null){
                    tmp.remove()
                }
                tmp = document.getElementById('colorWrapper_'+listLocation);
                tmp.classList.toggle('hover2',false);
            }
            listLocation = data.workName
            constructListDetail(dataTmp.value);
            var tmp = document.getElementById('listDetail_'+key);
            tmp.style.opacity = '1';
            tmp.style.width = '250px';
            tmp = document.getElementById('colorWrapper_'+key);
            tmp.classList.toggle('hover2',true);
        }

        var colorWrapper = document.createElement('div');
        colorWrapper.className = 'taskListBar';
        colorWrapper.id = 'colorWrapper_'+key;
        colorWrapper.style.position = 'absolute';
       
        wrapper.appendChild(colorWrapper);

        var icon = document.createElement('div');
        icon.className = 'taskListBarFlag';
        icon.id = 'taskListBarFlag_'+key;
        if(data.unprotected.status == 'init'){
            icon.style.backgroundImage = "url('static/images/flagProcess.png')";
        }else if(data.unprotected.status == 'processing'){
            icon.style.backgroundImage = "url('static/images/flagProcess.png')";
        }else if(data.unprotected.status == 'finish'){
            icon.style.backgroundImage = "url('static/images/flagFinish.png')";
        }else{
            icon.style.backgroundImage = "url('static/images/flagError.png')";
        }
        
        wrapper.appendChild(icon);

        var name = document.createElement('div');
        name.className = 'taskListBarTaskName';
        name.id = 'taskListBarTaskName'+key;
        name.innerHTML = key;
        wrapper.appendChild(name);

        var time = document.createElement('div');
        time.className = 'taskListBarTimeCost';
        time.id = 'time_'+key; //

        if(data.unprotected.status == 'finish'){
            
            if(data.unprotected.info.timeCost != null){
                console.log('finish work',data.unprotected.info.progress)
                var timeCost = new Date(data.unprotected.info.timeCost);
                time.innerHTML = timeCost.toISOString().substr(11, 8);
            }
           
        }else{
            console.log('unfinish work',data.unprotected.info.progress)
            var timeNow = new Date();

            timeNow = timeNow.valueOf();
            var num = timeNow - data.unprotected.info.startTime;
            var timeCost = new Date(num);
        
        
            time.innerHTML = timeCost.toISOString().substr(11, 8);
            
        }

        wrapper.appendChild(time);
        

        var progress = document.createElement('div');
        progress.className = 'taskListBarProgress';
        progress.id = 'progress_'+key;
        progress.innerHTML = (data.unprotected.info.progress*100).toFixed(2)+'%';
        wrapper.appendChild(progress); //progress

    }else{ //update exist element
        //console.log('update ',key);
        //constructListDetail(data);
        var tmp = document.getElementById('time_'+key);
        if(tmp == null){
            return;
        }
        if(data.unprotected.status == 'finish'){
            
            if(data.unprotected.info.timeCost != null){
                
                var timeCost = new Date(data.unprotected.info.timeCost);
                tmp.firstChild.data = timeCost.toISOString().substr(11, 8);
            }
            var dataWrap = []
            var dataSub = {}
            dataSub.workName = key
            dataSub.status = 'finish'
            dataWrap.push(dataSub)
            updateBlockStatus(dataWrap)
           
        }else{
           
            var timeNow = new Date();

            timeNow = timeNow.valueOf();
            var num = timeNow - data.unprotected.info.startTime;
            var timeCost = new Date(num);
        
        
            tmp.firstChild.data = timeCost.toISOString().substr(11, 8);
            
        }

       tmp = document.getElementById('progress_'+key);
       tmp.firstChild.data = (data.unprotected.info.progress*100).toFixed(2)+'%';

       tmp = document.getElementById('taskListBarFlag_'+key)
        if(data.unprotected.status == 'init'){
            tmp.style.backgroundImage = "url('static/images/flagProcess.png')";
        }else if(data.unprotected.status == 'processing'){
            tmp.style.backgroundImage = "url('static/images/flagProcess.png')";
        }else if(data.unprotected.status == 'finish'){
            tmp.style.backgroundImage = "url('static/images/flagFinish.png')";
        }else{
            tmp.style.backgroundImage = "url('static/images/flagError.png')";
        }
        tmp.value = data.unprotected.status

    }
}

function removeSubMenu(parent){
        var check = document.getElementById('subMenu_'+parent.id)
        if(check != null){
            check.remove()
           
        }else{
            setTimeout(() => {
                removeSubMenu(parent) 
            }, 200);
        }
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


function createBlockSubMenu(data){
    if(typeof(data) == 'string'){
        data = JSON.parse(data)
    }
   
    var idTmp = 'heatBlock_'+data.workName+'_'+data.unprotected.block.index
    var parent = document.getElementById(idTmp)
    var  subMenu = document.createElement('div')
    subMenu.id = 'subMenu_'+idTmp
    subMenu.className = 'subMenuWrapper'
   
    var mLef = parent.clientWidth/2 || parent.offsetWidth/2

    subMenu.style.marginTop = '-75px'
    subMenu.style.marginLeft = -70+mLef + 'px'
   

    var arrow = document.createElement('div')
    arrow.id = 'arrow'
    arrow.className = 'arrow'

    //info index
    var indexInfo = document.createElement('div')
    indexInfo.className = 'subMenuInfo'
    indexInfo.innerHTML = '编号: '+ data.unprotected.block.index
    indexInfo.style.marginTop = '3px'
    subMenu.appendChild(indexInfo)
    //info status
    var statusInfo = document.createElement('div')
    statusInfo.className = 'subMenuInfo'
    statusInfo.style.marginTop = '3px'
    statusInfo.style.marginLeft = '70px'

    var color = parent.style.backgroundColor
    var status;
    // console.log(rgb2hex(color))
    if(rgb2hex(color) == '#abaaa9'){
        status = 'init'
    }else if(rgb2hex(color)  == '#617bfa'){
        status = 'processing'
    }else if(rgb2hex(color)  == '#73c700'){
        status = 'validated'
    }else if(rgb2hex(color)  == '#ffd700'){
        status = 'preDone'
    } else{
        status = 'unknown'
    }


    statusInfo.innerHTML = '状态: '+status
    subMenu.appendChild(statusInfo)
    //info start time
    var startInfo = document.createElement('div')
    startInfo.className = 'subMenuInfo'
    var dateDisp = new Date(data.unprotected.info.startTime)
    startInfo.innerHTML = '开始时间: '+dateDisp.toLocaleString()
    startInfo.style.width = '140px'
    startInfo.style.marginTop = '18px'
    subMenu.appendChild(startInfo)
    //info time cost
    var timeCostInfo = document.createElement('div')
    timeCostInfo.className = 'subMenuInfo'
    if(data.unprotected.info.timeCost == null){
        date = new Date()
        data.unprotected.info.timeCost = date.valueOf() - data.unprotected.info.startTime
    }
    timeCostInfo.innerHTML = '耗时: '+ (data.unprotected.info.timeCost/1000/60).toFixed(2)+' Min'
    timeCostInfo.style.width = '140px'
    timeCostInfo.style.marginTop = '32px'
    subMenu.appendChild(timeCostInfo)
    //retry button
    var retyButton = document.createElement('div')
    retyButton.className = 'retyButton'
    retyButton.innerHTML = '重新计算'
    
    retyButton.onclick = function(){
        var currentStatus = rgb2hex(parent.style.backgroundColor)
        if(retyButton.innerHTML == '发送中' || currentStatus == '#73c700' || currentStatus == '#ffd700' || currentStatus == '#abaaa9'){
          
            return
        }
       
        ipcManager.clientEmit('resendBlock',data.workName+'_'+data.unprotected.block.index)


        retyButton.innerHTML = '发送中'
        retyButton.classList.toggle('retyButtonPushed',true)
       
      
        setTimeout(() => {
            parent.style.backgroundColor = '#abaaa9'
            retyButton.classList.toggle('retyButtonPushed',false)
            retyButton.innerHTML = '重新计算'
        }, 1200);
      
    }
    subMenu.appendChild(retyButton)
    subMenu.appendChild(arrow)

    parent.appendChild(subMenu)
   

    
}

function initHeatMap(data){

    if(typeof(data) == 'string'){
        data = JSON.parse(data)
    }
    var parent = document.getElementById('heatMap_'+data.workName)
    var indexs = data.unprotected.block.indexs
    sp = indexs.split('_')
    if(sp.length != 2){
        return
    }
    var idxW = parseInt(sp[0])
    var idxH = parseInt(sp[1])

    var w = parent.clientWidth || parent.offsetWidth
    var h = parent.clientHeight || parent.offsetHeight
    var wPs = 0.95/idxW * w
    var hPs = 0.95/idxH * h
    var wSpacePs = 0.05/idxW * w
    var hSpacePs = 0.05/idxH * h
    //create blocks
    for(var i=0;i<idxW;i++){
        for(var j=0;j<idxH;j++){
            var tmp = document.createElement('div')
            tmp.style.position = 'absolute'
            tmp.id = 'heatBlock_'+data.workName+'_'+i+'_'+j
            tmp.style.width = wPs+'px'
            tmp.style.height = hPs+'px'
            tmp.style.marginLeft = i*(wPs+wSpacePs)+'px'
            tmp.style.marginTop =  j*(hPs+hSpacePs)+'px'
            tmp.style.backgroundColor = '#ABAAA9'
            tmp.style.borderRadius = '10%'

            tmp.onmouseenter = function(){
                var sp = this.id.split('_')
                var len = sp.length
                ipcManager.clientEmit(
                    'getBlockInfo',
                    data.workName+'_'+sp[len -2]+'_'+sp[len -1]
                );
                

            }

           

            tmp.onmouseleave = function(){

                removeSubMenu(this)
            }
       
            parent.appendChild(tmp)
            
        }
    }
    //update all blocks as init
    ipcManager.clientEmit(
        'updateBlockStatusReq',
        data.workName
    );

}

function constructListDetail(data){

   
    if(typeof(data) == 'string'){
        data = JSON.parse(data);
    }

    var parent = document.getElementById('rightWrapper');
    if(parent == null){
        parent = document.createElement('div');
        parent.className = 'rightWrapper';
        parent.id = 'rightWrapper';
        var grandPa = document.getElementById('listValueWrapper');
        grandPa.appendChild(parent);

    }
    
    
    var listValueDetail = document.createElement('div');
    listValueDetail.className = 'listValueDetailWrapper';
    listValueDetail.id = 'listDetail_'+data.workName;
    parent.appendChild(listValueDetail);
    
    var name = document.createElement('div');
    name.className = 'detailTextBig';
    name.innerHTML = '文件名: '+data.workName;
    listValueDetail.appendChild(name);

    var fileSize = document.createElement('div');
    fileSize.className = 'detailText';
    fileSize.style.marginTop = '40px';
    fileSize.innerHTML = '大小: 125.34M';
    listValueDetail.appendChild(fileSize);

    var uploadTime = document.createElement('div');
    uploadTime.className = 'detailText';
    uploadTime.style.marginTop = '40px';
    uploadTime.style.marginLeft = '100px';
    uploadTime.innerHTML = '上传时间: '+(new Date(data.unprotected.info.startTime)).toUTCString();
    listValueDetail.appendChild(uploadTime);

    var cameraInfo = document.createElement('div');
    cameraInfo.className = 'detailText';
    cameraInfo.innerHTML = '相机: Camera_01';
    cameraInfo.style.marginTop = '60px';
    listValueDetail.appendChild(cameraInfo);

    var plugInInfo = document.createElement('div');
    plugInInfo.className = 'detailText';
    plugInInfo.innerHTML = '插件: Vary_6.0';
    plugInInfo.style.marginTop = '60px';
    plugInInfo.style.marginLeft = '100px';
    listValueDetail.appendChild(plugInInfo);

    var gammaInfo = document.createElement('div');
    gammaInfo.className = 'detailText';
    gammaInfo.innerHTML = '伽马校正: 1.0';
    gammaInfo.style.marginTop = '80px';
    listValueDetail.appendChild(gammaInfo);

    var panorama = document.createElement('div');
    panorama.className = 'detailText';
    panorama.innerHTML = '全景: OFF';
    panorama.style.marginTop = '80px';
    panorama.style.marginLeft = '100px';
    listValueDetail.appendChild(panorama);


    var statusText = document.createElement('div');
    statusText.className = 'detailText';
    statusText.style.marginTop = '100px';
    statusText.id = 'detailTextProgress_'+data.workName;
    statusText.innerHTML = '进度: '+data.unprotected.info.progress.toFixed(2)+'%';
    listValueDetail.appendChild(statusText);

    var estimated = document.createElement('div');
    estimated.className = 'detailText';
    estimated.id = 'detailTextEstimated_'+data.workName;
    estimated.style.marginTop = '100px';
    estimated.style.marginLeft = '100px';
    if(data.unprotected.info.progress != 0){
        var alreadyCost =  new Date();
        var timeNow = alreadyCost;
        alreadyCost = alreadyCost.valueOf() - data.unprotected.info.startTime;
        alreadyCost = alreadyCost/ data.unprotected.info.progress;
        estimated.innerHTML = '预计剩余时间: '+(new Date(alreadyCost+timeNow.valueOf())).toUTCString();
    }else{
        estimated.innerHTML = '预计剩余时间: ∞';
    }

    listValueDetail.appendChild(estimated);

    var status = document.createElement('div');
    status.className = 'detailText';
    status.style.marginTop = '120px';
    // status.style.marginLeft = '100px';
    status.id = 'detailTextStatus_'+data.workName;
    status.innerHTML = '状态: '+data.unprotected.status;
    listValueDetail.appendChild(status);

    var statusDetail = document.createElement('div');
    statusDetail.className = 'detailText';
    statusDetail.style.marginTop = '140px';

    statusDetail.id = 'statusDetail'+data.workName;
    statusDetail.innerHTML = '上传中(1/5): '+'1.23 M/s';
    listValueDetail.appendChild(statusDetail);

    var heatMap = document.createElement('div');
    heatMap.className = 'imageWrapper';
    heatMap.id = 'heatMap_'+data.workName
    listValueDetail.appendChild(heatMap);
    
    initHeatMap(data)


    var preview = document.createElement('div');
    preview.className = 'imageWrapper';
    preview.style.marginLeft = '188px';
    listValueDetail.appendChild(preview);

    // listValueDetail.style.width = '250px';
    // listValueDetail.style.opacity = '1.0';

    var deleteButton = document.createElement('div');
    deleteButton.className = 'deleteButton';
    listValueDetail.appendChild(deleteButton);
    deleteButton.onclick = function(){
        //delte from list
        var key = data.workName;
        var list = document.getElementById('taskListBar_'+key);
        var detail = document.getElementById('listDetail_'+key);
        list.remove()
        detail.remove()
        listLocation = null;
        console.log('delete ',key);
        // //delete from db

        ipcManager.clientEmit(
            'deleteTask',
            key
        );
    }

    

}

function mainUpdate(data){
    var breath = document.getElementById('breatinghLight')
    if(data.powerSharing && breath.className == 'breath-light2'){
        breath.className = 'breath-light'
        breath.firstChild.data = '算力共享中'
    }else if(!data.powerSharing && breath.className == 'breath-light'){
        breath.className = 'breath-light2'
        breath.firstChild.data = '共享已停止'
    }


    var nodeNumber = document.getElementById('infoTile1_2');
    var balanceCNC = document.getElementById('infoTile4_2');
    var speedDisplay = document.getElementById('infoTile2_2')
    if(speedDisplay == null){
        return
    }
   
    var totalSpeed =  data.speed
    var count = 0
    while(totalSpeed >= 1024 && count < 4){
        totalSpeed = totalSpeed / 1024
        count++
    }
    totalSpeed = totalSpeed.toFixed(2)
    
    if(count == 0){
        speedDisplay.firstChild.data = totalSpeed+' B/s'
    }else if(count == 1){
        speedDisplay.firstChild.data = totalSpeed+' Kb/s'
    }else if(count == 2){
        speedDisplay.firstChild.data = totalSpeed+' Mb/s'
    }else{
        speedDisplay.firstChild.data = totalSpeed+' Gb/s'
    }
    //update local progress
    data.localProgresses.forEach(item => {
      
        var tmp = {}
        tmp.key = item.name
        tmp.value = (item.progress*100).toFixed(2)+' %'
       if(item.progress == 1){
           tmp.flag = 1
       }
       addCarouselItem(tmp)
    })


    nodeNumber.firstChild.data = data.nodeNumber;
    balanceCNC.firstChild.data = data.balanceCNC;
    var workList = data.workList;

    var parent = document.getElementById('leftWrapper');
    if(parent == null){
        parent = document.createElement('div');
        parent.className = 'leftWrapper';
        parent.id = 'leftWrapper';
        var grandPa = document.getElementById('listValueWrapper');
        grandPa.appendChild(parent);
    }
    for(var i=0;i<workList.length;i++){
        
        constructList(parent,workList[i]);
    }
}

function settingPage(){
    pageCommon('Settings');
}

function exitPage(){
    pageCommon('Exit');
    loginPage();
}

function showAll(parent,flag){
    if(parent == null || typeof(parent) != 'object'){
        return
    }
    var status = 'block'
    if(flag == null || flag == true){
       
    }else{
       status = 'none'
    }

    var childs = parent.childNodes
    
    for(var i=0;i<childs.length;i++){
        
       if(typeof childs[i] === 'object' ){
           if(typeof childs[i].style === 'undefined'){

           }else{
            childs[i].style.display = status
            showAll(childs[i],flag)
           }     
        } 
    } 
}


function dividorSwitch(setName,flag){
    var msg = {}
    msg.setName = setName
    if(flag){
        msg.status = 'active'
    }else{
        msg.status = 'inactive'
    }

    ipcManager.clientEmit(
        'resetDividorStatus',
        msg
    )
}


function resetDividorStatus(obj){


    if(obj.className == 'dividorStatusButtonActive'){
        obj.className = 'dividorStatusButtonDisable'
        dividorSwitch(obj.value,false)

    }else if(obj.className == 'dividorStatusButtonDisable'){
        obj.className = 'dividorStatusButtonActive'
        dividorSwitch(obj.value,true)
    }
   

}

function updateActiveDividor(ret){
    console.log('Update active dividor')
    if(ret == null){
        console.error('Empty dividor info')
        return
    }
    
    var dividorInfo = document.getElementById('dividorInfo')
    if(dividorInfo == null){
        dividorInfo = document.createElement('div')
        dividorInfo.className = 'dividorInfo'
        dividorInfo.id = 'dividorInfo'
    }

    ret.forEach(element => {
        console.log('construct ',element)
        var tmp = document.getElementById(element.setName+'_list')
        if(tmp == null){
            tmp = document.createElement('div')
            tmp.className = 'dividorInfoItemWrapper'
            tmp.id = element.setName+'_list'

            var dName = document.createElement('div')
            dName.innerHTML = element.dividorName
            dName.style.position = 'absolute'
            dName.style.paddingLeft = '5.2%'
            dName.style.marginTop = '-3px'
            tmp.appendChild(dName)

            var sName = document.createElement('div')
            sName.innerHTML = element.setName
            sName.style.position = 'absolute'
            sName.style.marginTop = '-3px'
            sName.style.marginLeft = '40%'
            tmp.appendChild(sName)

            var statusButton = document.createElement('div')
            statusButton.value = element.setName
            if(element.status == 'active'){
                
                dividorSwitch(statusButton.value,true)
                statusButton.className = 'dividorStatusButtonActive'
            }else{
                dividorSwitch(statusButton.value,false)
                statusButton.className = 'dividorStatusButtonDisable'
            }

            statusButton.onclick=function(){
                resetDividorStatus(statusButton)
            }

            tmp.appendChild(statusButton)


            dividorInfo.appendChild(tmp)

        }else{
            console.log('already exist ',element,tmp)
        }
    });


}

function updateAppStoreInfo(ret){
     console.log(ret)
    var parent = document.getElementById('appStoreItemList')
    if(parent == null){
        console.error('No app store list (parent) find')
    }
    for(var i=0;i<ret.length;i++){
        var tmp = ret[i].value
        if(tmp == null)return
        if(typeof(tmp) == 'string'){
            tmp = JSON.parse(tmp)
        }

        var item = document.createElement('div')
        item.className = 'appItem'
        item.id = 'appItem_'+tmp.key
        parent.appendChild(item)

        var name = document.createElement('div')
        name.className = 'storeText'
        name.innerHTML = tmp.setName

        var size = document.createElement('div')
        size.className = 'storeText'
        size.innerHTML = '50M'
        size.style.marginLeft = '100px'

        var envriment = document.createElement('div')
        envriment.className = 'storeText'
        envriment.innerHTML = 'Linux/MacOSX'
        envriment.style.marginLeft = '200px'

        var uploader = document.createElement('div')
        uploader.className = 'storeText'
        uploader.innerHTML = tmp.uploader
        uploader.style.marginLeft = '300px'

        var preice = document.createElement('div')
        preice.className = 'storeText'
        preice.innerHTML = '免费'
        preice.style.marginLeft = '400px'

        var description = document.createElement('div')
        description.className = 'storeText'
        description.innerHTML = tmp.description
        description.style.marginLeft = '500px'

        var getButton = document.createElement('div')
        getButton.className = 'storeBuyButton'
        getButton.id = tmp.setName
        getButton.onclick = function(){
            var id = this.id
            ipcManager.clientEmit(
                'getAppSet',
                id
            )
            console.log('get set')
        
        }

        item.appendChild(name)
        item.appendChild(size)
        item.appendChild(envriment)
        item.appendChild(uploader)
        item.appendChild(preice)
        item.appendChild(description)
        if(tmp.local == true){

        }else{
            item.appendChild(getButton)
        }
        
       

    }

    // animation dely
    setTimeout(() => {

        for(var i=0;i<ret.length;i++){
            var tmp = ret[i].value
            if(typeof(tmp) == 'string'){
                tmp = JSON.parse(tmp)
            }
            var item = document.getElementById('appItem_'+tmp.key)
            item.style.height = '30px'
            item.style.opacity = '1.0'
        }
        
    }, 200);



}

function releaseAppSet(parent){
    var popoutInput = document.getElementById('popoutInput')
    if(popoutInput == null){
        popoutInput = document.createElement('div')
        popoutInput.className = 'uploadPopOut'
        popoutInput.id = 'popoutInput'
        parent.appendChild(popoutInput)

        var selectButton = document.createElement('button')
        selectButton.innerHTML = '选择配置文件'
        selectButton.className = 'doSelectButton'
        selectButton.onclick = function(){
            window.ipcRender.send('select-file', 'configure');
        }
        popoutInput.appendChild(selectButton)

        var cancelButton = document.createElement('div')
        cancelButton.className = 'doCancelButton'
        cancelButton.innerHTML = '取消'
        cancelButton.onclick = function(){
            while(popoutInput.firstChild){
                delete popoutInput.removeChild(popoutInput.firstChild)
            }
            parent.removeChild(popoutInput)

        }
        popoutInput.appendChild(cancelButton)

    }else{
       
        
    }

    window.ipcRender.on('selected-file',(event, arg) =>{
        if(arg != null ){
            console.log('selected-file',arg)
            if(arg.value.length > 0){
                arg.value[0] = arg.value[0].replace(/\\/g,'/')
                ipcManager.clientEmit(
                    'releaseSet',
                    arg.value[0]
                );
                while(popoutInput.firstChild){
                    delete popoutInput.removeChild(popoutInput.firstChild)
                }
                var notice = document.createElement('div')
                notice.className = 'noticeText'
                notice.innerHTML = "AppSet上传成功，请勿立即关闭客户端以确保数据成功的分布到网络中！"
                popoutInput.appendChild(notice)
                var number = 30
                var count = document.createElement('div')
                count.className = 'countDown'
                count.innerHTML = number
                popoutInput.appendChild(count)

                notice.style.opacity = 1
                count.style.opacity = 1
                var handle = setInterval(() => {
                    number--
                    count.firstChild.data = number
                    if(number == 0){
                        count.style.opacity = 0
                        notice.style.opacity = 0
                    }
                }, 1000);
                setTimeout(() => {
                    clearInterval(handle)
                    popoutInput.removeChild(notice)
                    popoutInput.removeChild(count)
                    parent.removeChild(popoutInput)
                }, 31000);
            }
            //update ui
        }  

    })
}



function appStorePage(){

    var mainWrapper = pageCommon('AppStore')

    //list main wrapper
    var listWrapper = document.createElement('div')
    listWrapper.className = 'appStoreListWrapper'
    mainWrapper.appendChild(listWrapper)


    // menu
    var appStoreMenu = document.createElement('div')
    appStoreMenu.className = 'appStoreMenu'
    listWrapper.appendChild(appStoreMenu)

    var titleBar = document.createElement('div')
    titleBar.className = 'storeTitleBar'
    var name = document.createElement('div')
    name.className = 'storeTitleBarText'
    name.innerHTML = '名称'

    var size = document.createElement('div')
    size.className = 'storeTitleBarText'
    size.innerHTML = '大小'
    size.style.marginLeft = '100px'

    var envriment = document.createElement('div')
    envriment.className = 'storeTitleBarText'
    envriment.innerHTML = '环境要求'
    envriment.style.marginLeft = '200px'

    var uploader = document.createElement('div')
    uploader.className = 'storeTitleBarText'
    uploader.innerHTML = '上传者'
    uploader.style.marginLeft = '300px'

    var preice = document.createElement('div')
    preice.className = 'storeTitleBarText'
    preice.innerHTML = '售价'
    preice.style.marginLeft = '400px'

    var discription = document.createElement('div')
    discription.className = 'storeTitleBarText'
    discription.innerHTML = '描述'
    discription.style.marginLeft = '500px'



    titleBar.appendChild(name)
    titleBar.appendChild(size)
    titleBar.appendChild(envriment)
    titleBar.appendChild(uploader)
    titleBar.appendChild(preice)
    titleBar.appendChild(discription)
    

    //list
    var appStoreItemList = document.createElement('div')
    appStoreItemList.className = 'appStoreItemList'
    appStoreItemList.id = 'appStoreItemList'
    listWrapper.appendChild(appStoreItemList)
    appStoreItemList.appendChild(titleBar)
    var uploadButton = document.createElement('div')
    uploadButton.className = 'appStoreUploadButton'

    uploadButton.onclick = function(){
       
        releaseAppSet(mainWrapper)
     
    }
    appStoreMenu.appendChild(uploadButton)

    
   

    ipcManager.clientEmit(
        'getAllSet',
        'allSet'
    )



}

function pageCommon(location){
    pageLocation = location

    while (document.body.firstChild) {
        document.body.removeChild( document.body.firstChild);
    }

    var mainWrapper = document.createElement('div');
    mainWrapper.className = 'mainWrapper';
    document.body.appendChild(mainWrapper);

   

    var titleWrapper = document.createElement('div');
    titleWrapper.className = 'titleWrapper';
    mainWrapper.appendChild(titleWrapper);

    var breath = document.createElement('div')
    breath.className = 'breath-light2'
    breath.id = 'breatinghLight'
    breath.innerHTML = '共享已停止'
    breath.onclick = function(){
        if(breath.className == 'breath-light'){
            breath.className = 'breath-light2'
            breath.innerHTML = '共享已停止'
            ipcManager.clientEmit('changeDeviceStatus',{status:'stop'})
        }else{
            breath.className = 'breath-light'
            breath.innerHTML = '算力共享中'
            ipcManager.clientEmit('changeDeviceStatus',{status:'start'})
        }
    }
    titleWrapper.appendChild(breath)

    var searchBar = document.createElement('input');
    searchBar.className = 'searchBar';
    searchBar.type = 'text';
    searchBar.style.outline = '0';
    searchBar.style.backgroundImage = "url('static/images/search.png')";
    searchBar.onclick = function(){
        searchBar.style.width = '50%';
        searchBar.style.backgroundImage = 'none';
    }

    searchBar.onblur = function(){
        searchBar.style.width = '25%';
        setTimeout(() => {
            searchBar.style.backgroundImage = "url('static/images/search.png')";
        }, 300);
        
    }
    titleWrapper.appendChild(searchBar);

    // //transfer status
    // var transfer = document.createElement('div')
    // transfer.className = 'transferStatus'
    // titleWrapper.appendChild(transfer);

    var menuWrapper = document.createElement('div');
    menuWrapper.className = 'sideMenuWrapper';
    mainWrapper.appendChild(menuWrapper);

    var icon = document.createElement('div');
    icon.className = 'iconWrapper';
    icon.style.backgroundImage = "url('static/images/logo.png')"
   
    menuWrapper.appendChild(icon);

    var menuHome = document.createElement('div');
    menuHome.className = 'menuBar';
    menuHome.style.backgroundImage = "url('static/images/home.png')";
    menuHome.innerHTML = '主页';
    menuHome.id = 'Home';
   

    menuHome.onclick = function(){
        pageLocation = menuHome.id;
        mainPage();
    }
    menuWrapper.appendChild(menuHome);

    var menuAccount = document.createElement('div');
    menuAccount.className = 'menuBar';
    menuAccount.style.backgroundImage = "url('static/images/account.png')";
    menuAccount.innerHTML = '账户';
    menuAccount.id = 'Account';
    menuAccount.onclick = function(){
       
        pageLocation = menuAccount.id;
        accountPage();
       
       
        
    }
    menuWrapper.appendChild(menuAccount);

    var appStore = document.createElement('div');
    appStore.className = 'menuBar';
    appStore.style.backgroundImage = "url('static/images/appstore.png')";
    appStore.innerHTML = '应用商店';
    appStore.id = 'AppStore';
    appStore.onclick = function(){
       
        pageLocation = appStore.id;
        appStorePage();
    }
    menuWrapper.appendChild(appStore);

    var menuSetting = document.createElement('div');
    menuSetting.className = 'menuBar';
    menuSetting.style.backgroundImage = "url('static/images/setting.png')";
    menuSetting.innerHTML = '设置';
    menuSetting.id = 'Settings';
    menuSetting.onclick = function(){
       
        pageLocation = menuSetting.id;
        settingPage();
    }
    menuWrapper.appendChild(menuSetting);


      // supporting dividor(app sets)
    var dividorInfo = document.createElement('div')
    dividorInfo.className = 'dividorInfo'
    dividorInfo.id = 'dividorInfo'
    console.log('update active dividor request')
    ipcManager.clientEmit(
        'updateActiveDividor',
        "null"
    )
  
    menuWrapper.appendChild(dividorInfo)


    var menuLogout = document.createElement('div');
    menuLogout.className = 'menuBar';
    menuLogout.style.backgroundImage = "url('static/images/exit.png')";
    menuLogout.innerHTML = '退出';
    menuLogout.id = 'Exit';
    menuLogout.onclick = function(){
       
        pageLocation = menuLogout.id;
        exitPage();
    }
    menuWrapper.appendChild(menuLogout);

    if(pageLocation != null){
        document.getElementById(pageLocation).classList.toggle('hover',true);
        //delete old page
     }

    return mainWrapper;

}

function chart(parent,data1,data2){
    var chartWrap = document.createElement("div");
    //chartWrap.style.zIndex = "";
    chartWrap.style.position = "absolute";
    chartWrap.style.marginTop = "0%";
    chartWrap.style.width = "580px";
    chartWrap.style.height = "230px";
    var mainChart = echarts.init(chartWrap);

    var option = {

        tooltip: {
            trigger: 'axis',
            backgroundColor:'rgba(0,0,0,0.5)',
            textStyle:{
                color:'#bbbaba',
                fontSize: 8
            }
        },

        legend: {
            data:['Sales']
        },
        xAxis: {
            
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#bbbaba',//左边线的颜色
                    width:'2'//坐标线的宽度
                },
            },
            axisLabel:{
                show: true,
                textStyle:{
                    color:'#bbbaba',
                    fontSize: 8
                }
            },
            
            data: ["00:00","01:00","02.00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12.00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
        },
        yAxis: [
            {   
               
                axisLabel:{
                    show: true,
                    textStyle:{
                        color:'#bbbaba',
                        fontSize: 8
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#bbbaba',//左边线的颜色
                        width:'2'//坐标线的宽度
                    }
                },
                tooltip:{
                    show: true
                }
                
            },
            {
                
                axisLabel:{
                    show: true,
                    textStyle:{
                        color:'#bbbaba',
                        fontSize: 8
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#bbbaba',//左边线的颜色
                        width:'2'//坐标线的宽度
                    }
                },
            },
        ],
        series: [
            {
                
                name: '任务数量（个）.',
                type: 'bar',
                barWidth: 6,
                yAxisIndex : '0',
               
                itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 0, 0],
                        color: '#73c700',
                        opacity: 0.85
                    }
                },
                
                data: data1
            },
            {
               
                name: '平均消耗（元）.',
                type: 'bar',
                yAxisIndex : '1',
                barWidth: 6,
                //barGap:20,
                itemStyle: {
                    normal: {
                        barBorderRadius: [10, 10, 0, 0],
                        color: '#f26c4f',
                        opacity: 0.85
                    }
                },
                
                data: data2
            }
        ],


    };
    mainChart.setOption(option);
    parent.appendChild(chartWrap);
}



function accountPage(){
    var mainWrapper = pageCommon('Account');

    var accountWrapper = document.createElement('div');
    accountWrapper.className = 'accountWrapper';
    mainWrapper.appendChild(accountWrapper);

    var accountWrapperSub = document.createElement('div');
    accountWrapperSub.className = 'accountWrapperSub';
    accountWrapper.appendChild(accountWrapperSub);
   

    var accountImageWrapper = document.createElement('div');
    accountImageWrapper.className = 'accountImageWrapper';
    accountWrapperSub.appendChild(accountImageWrapper);

    var accountUserName = document.createElement('div');
    accountUserName.className = 'accountUserName';
    accountUserName.innerHTML = 'SADI';
    accountWrapperSub.appendChild(accountUserName);

    var loginInfo = document.createElement('div');
    loginInfo.className = 'accountLoginInfo';
    loginInfo.innerHTML = '登陆设备数 <b>3</b>';
    accountWrapperSub.appendChild(loginInfo);

    var loginInfo2 = document.createElement('div');
    loginInfo2.className = 'accountLoginInfo2';
    loginInfo2.innerHTML = '最近登陆: <b>成都</b>';
    accountWrapperSub.appendChild(loginInfo2);

    var balanceButton = document.createElement('div');
    balanceButton.className = 'balanceButton';
    balanceButton.innerHTML = '&nbsp;¥100.25';
    accountWrapper.appendChild(balanceButton); 

    var pHistoryWarpper = document.createElement('div');
    pHistoryWarpper.className = 'purchaseHistoryWrapper';
    mainWrapper.appendChild(pHistoryWarpper); //accountInfoDetail
    var historyTitle = document.createElement('div');
    historyTitle.className = 'historyTitle';
    historyTitle.innerHTML = '消费列表';
    pHistoryWarpper.appendChild(historyTitle);

    var costListWrapper = document.createElement('div');
    costListWrapper.style.height = '80%';
    costListWrapper.style.width = '100%';
    costListWrapper.style.marginTop = '8%';
    costListWrapper.style.position = 'relative';
    pHistoryWarpper.appendChild(costListWrapper);

    for(var i = 0;i<5;i++){
        var tmp = document.createElement('div');
        tmp.className = 'costListText';
        tmp.innerHTML = i+"&nbsp;&nbsp;&nbsp;&nbsp;2019/07/07&nbsp;&nbsp;15:23:47 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; modle_test_123.zip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; -1 &nbsp; 元";
        costListWrapper.appendChild(tmp);
    }
    

    var accountInfoDetail = document.createElement('div');
    accountInfoDetail.className = 'accountInfoDetail';
    mainWrapper.appendChild(accountInfoDetail); //accountInfoDetail
    var recordTitle = document.createElement('div');
    recordTitle.className = 'historyTitle';
    recordTitle.innerHTML = '历史统计';
    accountInfoDetail.appendChild(recordTitle);

    var data1 = [14,34,56,78,99,44,67,89,100,140,123,122,99,100,6 ,89,34,56,3,77,10,66,23,56];
    var data2 = [22,35,12,56,67,77,21,32,43 ,100,55 ,22 ,34,98 ,78,55,23,45,1,5 ,7 ,35,78,23];
    chart(accountInfoDetail,data1,data2);


    setTimeout(() => {
        accountWrapperSub.classList.toggle('showSub',true);
        accountUserName.classList.toggle('showInfo',true);
        loginInfo.classList.toggle('showInfo',true);
        loginInfo2.classList.toggle('showInfo',true);
        // balanceButton.classList.toggle('showInfo',true);

    }, 5);

   
}

function mainPage(){
   

   var mainWrapper = pageCommon('Home');  
    var infoWrapper = document.createElement('div');
    infoWrapper.className = 'infoWrapper';
    infoWrapper.id = 'infoWrapper';
    mainWrapper.appendChild(infoWrapper);

    var infoBlock1 = document.createElement('div');
    infoBlock1.className = 'infoBlock';
    
    infoWrapper.appendChild(infoBlock1);
    var infoTile1_1 =document.createElement('div');
    infoTile1_1.className = 'infoTitle';
    infoTile1_1.innerHTML = '当前服务节点数';
    infoBlock1.appendChild(infoTile1_1);

    var infoTile1_2 =document.createElement('div');
    infoTile1_2.className = 'infoMain';
    infoTile1_2.innerHTML = '0';
    infoTile1_2.id = 'infoTile1_2';
    infoBlock1.appendChild(infoTile1_2);

    var infoBlock2 = document.createElement('div');
    infoBlock2.className = 'infoBlock';
    infoBlock2.style.marginLeft = '21%';
    infoWrapper.appendChild(infoBlock2);

    var infoTile2_1 =document.createElement('div');
    infoTile2_1.className = 'infoTitle';
    infoTile2_1.innerHTML = '全局下载速度';
    infoBlock2.appendChild(infoTile2_1);

    var infoTile2_2 =document.createElement('div');
    infoTile2_2.className = 'infoMain';
    infoTile2_2.innerHTML = '0';
    infoTile2_2.id = 'infoTile2_2';
    infoBlock2.appendChild(infoTile2_2);

    var infoBlock3 = document.createElement('div');
    infoBlock3.className = 'infoBlock';
    infoBlock3.style.marginLeft = '41%';
    infoWrapper.appendChild(infoBlock3);

    var infoTile3_1 =document.createElement('div');
    infoTile3_1.className = 'infoTitle';
    infoTile3_1.innerHTML = '当前任务进度';
    infoBlock3.appendChild(infoTile3_1);

    var infoTile3_2 =document.createElement('div');
    infoTile3_2.className = 'infoMain';
    infoTile3_2.id = 'infoTile3_2';
    infoBlock3.appendChild(infoTile3_2);

    var carWrapper = document.createElement('ul')
    carWrapper.className = 'list'
    infoTile3_2.appendChild(carWrapper)
    var hide = document.createElement('li')
    hide.className = 'hide'
    var prev = document.createElement('li')
    prev.className = 'prev'
    var act = document.createElement('li')
    act.className = 'act'
    var next = document.createElement('li')
    next.className = 'next'
    var next2 = document.createElement('li')
    next2.className = "next new-next"
    var swp = document.createElement('div')
    swp.className = 'swipe'
    infoTile3_2.appendChild(swp)

    carWrapper.appendChild(hide)
    carWrapper.appendChild(prev)
    carWrapper.appendChild(act)
    carWrapper.appendChild(next)
    carWrapper.appendChild(next2)
    initCarousel()
    var infoBlock4 = document.createElement('div');
    infoBlock4.className = 'infoBlock';
    infoBlock4.style.marginLeft = '61%';
   
   
    infoWrapper.appendChild(infoBlock4);

    var infoTile4_1 =document.createElement('div');
    infoTile4_1.className = 'infoTitle';
    infoTile4_1.innerHTML = '余额';
    infoBlock4.appendChild(infoTile4_1);

    var infoTile4_2 =document.createElement('div');
    infoTile4_2.className = 'infoMain';
    infoTile4_2.innerHTML = '0';
    infoTile4_2.id = 'infoTile4_2';
    infoBlock4.appendChild(infoTile4_2);

    // var infoTile4_3 =document.createElement('div');
    // infoTile4_3.className = 'infoTitleButton';
    // infoTile4_3.innerHTML = '≈ ¥';
    // infoTile4_3.id = 'infoTile4_3';
    // infoBlock4.appendChild(infoTile4_3);

    var listWrapper = document.createElement('div');
    listWrapper.className = 'listWrapper';
    listWrapper.id = 'listWrapper';
    mainWrapper.appendChild(listWrapper);

    var listTitle = document.createElement('div');
    listTitle.className = 'infoTitle';
    listTitle.style.color = '#181819';
    listTitle.innerHTML = '任务列表';
    listWrapper.appendChild(listTitle);

    var listValue = document.createElement('div');
    listValue.className = 'listValueWrapper';
    listValue.id = 'listValueWrapper';
    listWrapper.appendChild(listValue);
}

function updateBlockStatus(data){
   
    for(var i=0;i<data.length;i++){

        if(data[i].index != null){
            var id = 'heatBlock_'+data[i].workName+'_'+data[i].index
       
            var tmp = document.getElementById(id)
            if(tmp != null){
                if(data[i].status == 'validated'){
                    tmp.style.backgroundColor = '#73c700'
                }else if(data[i].status == 'init'){
                    tmp.style.backgroundColor = '#abaaa9'
                }else if(data[i].status == 'processing'){
                    tmp.style.backgroundColor = '#617bfa'
                    // TODO
                }else if(data[i].status == 'preDone' || data[i].status == 'validating'){
                    tmp.style.backgroundColor = '#ffd700'
                }
            }else{
            
            } 
    
        }else{

        }
        var tmp = document.getElementById('detailTextStatus_'+data[i].workName)
        if(tmp != null){
            var subTmp = document.getElementById('taskListBarFlag_'+data[i].workName)
            tmp.innerHTML = '状态: '+subTmp.value
        }

        tmp = document.getElementById('detailTextProgress_'+data[i].workName)
        if(tmp != null){
            var subTmp = document.getElementById('progress_'+data[i].workName)
            tmp.innerHTML = '进度: '+subTmp.innerHTML
        }
    } 
}


ipcManager.addClientListenner('gotBlockInfo',(data) => {
    createBlockSubMenu(data)
})

ipcManager.addClientListenner('notification',(data) => {
    const myNoti = new window.Notification(data.title,data)
})
ipcManager.addClientListenner('login',(data) => {
    
    if(data.status == 'YES'){
        window.nodeCore.process();
        mainPage();
    }else{
        console.error(data)
    }
})
ipcManager.addClientListenner('register',(data) => {
    if(data.status == 'YES'){
        loginPage();
    }
})
ipcManager.addClientListenner('mainUpdate',(data) => {
    if(pageLocation == 'Home'){
        mainUpdate(data)
    }
    
})
ipcManager.addClientListenner('updateBlockStatus',(data) => {
    updateBlockStatus(data)
})
ipcManager.addClientListenner('retAllSet',(data) => {
    updateAppStoreInfo(data)
})
ipcManager.addClientListenner('updateActiveDividor',(data) => {
    updateActiveDividor(data)
})
ipcManager.addClientListenner('updatePreview',(data) => {
    upatePreview(data)
})

ipcManager.connect('nodeServer')




function registerPage(){
    while (document.body.firstChild) {
        document.body.removeChild( document.body.firstChild);
    }

    var mainWrapper = document.createElement('div');
    mainWrapper.style.height = '450px';
    mainWrapper.style.width = '800px';
    mainWrapper.style.backgroundImage = "url('static/images/bg-login.png')";
    mainWrapper.style.backgroundSize ='100% 100%';
    mainWrapper.style.backgroundRepeat ='no-repeat';
    mainWrapper.style.overflow = 'visible';
    mainWrapper.style.position = 'absolute';
    mainWrapper.style.marginTop = '-8.5px';
    mainWrapper.style.marginLeft = '-8.5px';
    mainWrapper.style.webkitAppRegion = "drag";
    document.body.appendChild(mainWrapper);

    var phInput = document.createElement('input');
    phInput.style.position = 'absolute';
    phInput.style.height = '30px';
    phInput.style.width = '200px';
    phInput.style.borderRadius = '10px';
    phInput.style.outline = '0';
    phInput.style.border = '1px solid #d8d8d8';
    phInput.style.boxShadow = 'border background';
    phInput.style.marginTop = '100px';
    phInput.style.marginLeft = '100px';
    phInput.style.textIndent = '10px';
    phInput.name = 'text';
    phInput.type = 'text';
    phInput.id = 'phoneNumber';
    mainWrapper.appendChild(phInput);

    var pwInput = document.createElement('input');
    pwInput.style.position = 'absolute';
    pwInput.style.height = '30px';
    pwInput.style.width = '200px';
    pwInput.style.borderRadius = '10px';
    pwInput.style.outline = '0';
    pwInput.style.border = '1px solid #d8d8d8';
    pwInput.style.boxShadow = 'border background';
    pwInput.style.marginTop = '150px';
    pwInput.style.marginLeft = '100px';
    pwInput.style.textIndent = '10px';
    pwInput.name = 'text';
    pwInput.type = 'text';
    pwInput.id = 'phoneNumber';
    mainWrapper.appendChild(pwInput);


    var submitButton = document.createElement('div');
    submitButton.style.position = 'absolute';
    submitButton.style.height = '30px';
    submitButton.style.width = '200px';
    submitButton.style.borderRadius = '10px';
    submitButton.style.textIndent = '10px';
    submitButton.style.marginTop = '200px';
    submitButton.style.marginLeft = '100px';
    submitButton.style.border = '2px solid #73c700';
    submitButton.onclick = function(){
        console.log(phInput.value);
        console.log(pwInput.value);
        var data = {};
        data.phoneNumber = phInput.value;
        data.password = pwInput.value;
       var ret = window.nodeCore.register(data);
      
    }
    mainWrapper.appendChild(submitButton);

}

//for auto login
function decode(data){
   
    var tmp = data.slice(1,data.length-1);
    tmp = data[data.length-1]+tmp+data[0];
    
    tmp = window.code.decode(tmp);
    tmp = tmp.toString();
    
    return JSON.parse(tmp);
}

function encode(data){

    var str = JSON.stringify(data);
    str = window.buffer.from(str);
    var tmp = window.code.encode(str);
    tmp = tmp.toString();
    var ret = tmp.slice(1,tmp.length-1);
    ret = tmp[tmp.length-1]+ret+tmp[0];
    return ret;

}


function loginPage(){

    // if there was a saved data
    if(window.nodeCore.devStat.isLogin()){
        console.log('already login')
        mainPage()
        return
    }
 
    var path = window.appPath;
    if (window.fs.existsSync(path+'/pass')) {
        //file exists
        console.log('Login with tmp')
        var data = window.fs.readFileSync(path+'/pass');
        var dataDecode = decode(data.toString());
        window.nodeCore.login(dataDecode);
    }
    
    while (document.body.firstChild) {
        document.body.removeChild( document.body.firstChild);
    }

    var mainWrapper = document.createElement('div');
    mainWrapper.style.height = '500px';
    mainWrapper.style.width = '1000px';
    mainWrapper.style.backgroundImage = "url('static/images/bg-login.png')";
    mainWrapper.style.backgroundSize ='100% 100%';
    mainWrapper.style.backgroundRepeat ='no-repeat';
    mainWrapper.style.overflow = 'visible';
    mainWrapper.style.position = 'absolute';
    mainWrapper.style.marginTop = '-8.5px';
    mainWrapper.style.marginLeft = '-8.5px';
    mainWrapper.style.webkitAppRegion = "drag";
    document.body.appendChild(mainWrapper);

    //phone number input frame
    var phInput = document.createElement('input');
    phInput.style.position = 'absolute';
    phInput.style.height = '30px';
    phInput.style.width = '200px';
    phInput.style.borderRadius = '10px';
    phInput.style.outline = '0';
    phInput.style.border = '1px solid #d8d8d8';
    phInput.style.boxShadow = 'border background';
    phInput.style.marginTop = '130px';
    phInput.style.marginLeft = '120px';
    phInput.style.textIndent = '10px';
    phInput.name = 'text';
    phInput.type = 'text';
    phInput.id = 'phoneNumber';
    phInput.onkeyup = function(){
        this.value=this.value.replace(/\D/g,'')
    }
    phInput.onafterpaste = function(){
        this.value=this.value.replace(/\D/g,'');
    }
    
    mainWrapper.appendChild(phInput);

    //password input frame

    var pdInput = document.createElement('input');
    pdInput.style.position = 'absolute';
    pdInput.style.height = '30px';
    pdInput.style.width = '200px';
    pdInput.style.borderRadius = '10px';
    pdInput.style.textIndent = '10px';
    pdInput.style.outline = '0';
    pdInput.style.border = '1px solid #d8d8d8';
    pdInput.style.boxShadow = 'border background';
    pdInput.style.marginTop = '180px';
    pdInput.style.marginLeft = '120px';
    pdInput.name = 'text';
    pdInput.type = 'text';
    pdInput.id = 'passwordNumber';
    pdInput.type = 'password';
    
    
    mainWrapper.appendChild(pdInput);

    var remember = document.createElement('input');
    remember.type = 'checkbox';
    remember.className = 'logInCheckBox';
    remember.innerHTML ='Remember me?';
    mainWrapper.appendChild(remember);

    var submitButton = document.createElement('div');
    submitButton.style.position = 'absolute';
    submitButton.style.height = '30px';
    submitButton.style.width = '200px';
    submitButton.style.borderRadius = '10px';
    submitButton.style.textIndent = '10px';
    submitButton.style.marginTop = '230px';
    submitButton.style.marginLeft = '120px';
    submitButton.style.border = '2px solid #73c700';
    submitButton.onclick = function(){
        var data = {};
        data.phoneNumber = phInput.value;
        data.password = pdInput.value;
        if(remember.checked){
            var tmp = encode(data);
            window.fs.writeFile(window.appPath+'/pass',tmp,(err) => {
                if(err){
                    console.error(err);
                }
            });
        }

        window.nodeCore.login(data);
        
    }
    mainWrapper.appendChild(submitButton);

    var registerButton = document.createElement('div');
    registerButton.style.position = 'absolute';
    registerButton.style.height = '30px';
    registerButton.style.width = '200px';
    registerButton.style.borderRadius = '10px';
    registerButton.style.textIndent = '10px';
    registerButton.style.marginTop = '380px';
    registerButton.style.marginLeft = '120px';
    registerButton.style.border = '2px solid #73c700';
    registerButton.onclick = function(){
        console.log(phInput.value);
        console.log(pdInput.value);
        //window.nodeCore
        registerPage();
    }
    mainWrapper.appendChild(registerButton);

}