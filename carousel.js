var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "./css/style.css";
document.getElementsByTagName("head")[0].appendChild(link);

var CarouselValueStorage = {}
var cLocation = 0
var init = false

function fixIndex(idx,total){
    if(total == 0){
        return null
    }
    while(idx < 0){
        idx = idx + total
    }
    idx = idx % total
    return idx
}

var addCarouselItem = (item) => {
    if(item == null){
        return
    }
    CarouselValueStorage[item.key] = item
   
}

var removeCarouselItem = (item) => {
    if(item == null){
        return
    }
    delete CarouselValueStorage[item.key]
}


var preFunction = null
var netxFunction = null


var initCarousel = function(){
    if(init){
        return
    }
    const $ = selector => {
        return document.querySelector(selector);
      };
      
    function next() {
        if ($(".hide")) {
            $(".hide").remove(); 
        }
        
        /* Step */
        if ($(".prev")) {
            $(".prev").classList.add("hide");
            $(".prev").classList.remove("prev");
        }
        
        $(".act").classList.add("prev");
        $(".act").classList.remove("act");
        
        $(".next").classList.add("act");
        $(".next").classList.remove("next");
            
        /* New Next */
        $(".new-next").classList.remove("new-next");
        
        const addedEl = document.createElement('li');
        
        $(".list").appendChild(addedEl);
        addedEl.classList.add("next","new-next");
        cLocation++
        while ( $(".act").hasChildNodes()) {
            $(".act").removeChild( $(".act").lastChild);
        }
        var keys = Object.keys(CarouselValueStorage)
        var len = keys.length
        var fixed = fixIndex(cLocation,len)
        if(fixed != null){
            var prg = document.createElement('div')
            prg.innerHTML = CarouselValueStorage[keys[fixed]].value
            prg.className = 'carouselTextBig'
            $(".act").appendChild(prg)
            var text = document.createElement('div')
            text.innerHTML = CarouselValueStorage[keys[fixed]].key
            text.className = 'carouselTextLittle'
            $(".act").appendChild(text)
            if(CarouselValueStorage[keys[fixed]].flag == 1){
                delete CarouselValueStorage[keys[fixed]]
            }
        }
        init = true
    }

    netxFunction = next

    function prev() {
        $(".new-next").remove();
          
        /* Step */
      
        $(".next").classList.add("new-next");
      
        $(".act").classList.add("next");
        $(".act").classList.remove("act");
      
        $(".prev").classList.add("act");
        $(".prev").classList.remove("prev");
      
        /* New Prev */
      
        $(".hide").classList.add("prev");
        $(".hide").classList.remove("hide");
      
        const addedEl = document.createElement('li');
      
        $(".list").insertBefore(addedEl, $(".list").firstChild);
        addedEl.classList.add("hide");
        cLocation--
        while ( $(".act").hasChildNodes()) {
            $(".act").removeChild( $(".act").lastChild);
        }
        var keys = Object.keys(CarouselValueStorage)
        var len = keys.length
        var fixed = fixIndex(cLocation,len)
        if(fixed != null){
            var text = document.createElement('div')
            text.className = 'infoMain'
            text.innerHTML = CarouselValueStorage[keys[fixed]].value
            $(".act").appendChild(text)
            delete CarouselValueStorage[keys[fixed]]
            
        }
    }

    preFunction = prev
      
    slide = element => {
    /* Next slide */
    
    if (element.classList.contains('next')) {
        next();
        
    /* Previous slide */
        
    } else if (element.classList.contains('prev')) {
        prev();
    }
    }

    const slider = $(".list"),
    swipe = new Hammer($(".swipe"));

    slider.onclick = event => {
    slide(event.target);
    }

    swipe.on("swipeleft", (ev) => {
    next();
    });

    swipe.on("swiperight", (ev) => {
    prev();
    });

}



var clearFlag = false
setInterval(() => {
    if(!init){
        return
    }
    if(Object.keys(CarouselValueStorage).length){
        netxFunction();
        clearFlag = false
    }else{
        if(!clearFlag){
            preFunction();
            clearFlag = true
        }
    }
}, 3000);


