var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "./css/updateStyle.css";
document.getElementsByTagName("head")[0].appendChild(link);


var title = document.createElement('div')
title.innerHTML = '正在下载更新，已完成：'
title.className = 'title'
document.body.appendChild(title)
var complated = document.createElement('div')
complated.className = 'complate'
complated.id = 'complate'
complated.innerHTML = '0%'
title.appendChild(complated)
var progressNon = document.createElement('div')
progressNon.className = 'progressNon'
document.body.appendChild(progressNon)
var progress = document.createElement('div')
progress.className = 'progress'
progress.id = 'progress'
document.body.appendChild(progress)
var w = 500

var speed = document.createElement('div')
speed.id = 'speed'
speed.className = 'speed'
speed.innerHTML = '0 Kb/s'
document.body.appendChild(speed)

window.ipcRender.on('updateDownloadProgress',(event,data) => {
    var tmp = document.getElementById('progress')
    tmp.style.width =( w * data.percent / 100)+'px'
    complated.innerHTML = data.percent.toFixed(2)+'%'
    var disp = data.bytesPerSecond
    if(disp > 1000000000){
        disp = disp /1024/1024/1024
        disp = disp +" Gb/s"
    }else if(disp > 1000000){
        disp = disp /1024/1024
        disp = disp +" Mb/s"
    }else if(disp > 1000){
        disp = disp /1024
        disp = disp +" Kb/s"
    }else{
        disp = disp + " B/s"
    }
    speed.innerHTML = data.bytesPerSecond / 1024
})