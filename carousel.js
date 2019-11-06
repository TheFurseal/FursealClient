document.write("<script language='javascript' src='./hammer.js'></script>");

var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "./css/style.css";
document.getElementsByTagName("head")[0].appendChild(link);

var CarouselValueStorage = []
var cLocation = 0

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
    var idx = -1
   for(var i=0; i<CarouselValueStorage.length; i++){
        if(CarouselValueStorage[i].key == item.key){
            CarouselValueStorage[i] = item
            idx = i
        }
   }
   if(idx == -1){
       CarouselValueStorage.push(item)
   }
}

var removeCarouselItem = (item) => {
    for(var i=0; i<CarouselValueStorage.length; i++){
        if(CarouselValueStorage[i].key == item.key){
            delete CarouselValueStorage[i]
        }
   }
}

var Carousel = function(){
    // carousel
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
        var fixed = fixIndex(cLocation,CarouselValueStorage.length)
        console.log(' ++ '+fixed)
        if(fixed != null){
            var text = document.createElement('div')
            text.className = 'infoMain'
            text.innerHTML = CarouselValueStorage[fixed].value
            $(".act").appendChild(text)
        }
      }
      
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
        var fixed = fixIndex(cLocation,CarouselValueStorage.length)
        console.log(' -- '+fixed)
        if(fixed != null){
            var text = document.createElement('div')
            text.className = 'infoMain'
            text.innerHTML = CarouselValueStorage[fixed].value
            $(".act").appendChild(text)
        }
    }
      
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

    setInterval(() => {
        if(CarouselValueStorage.length){
            next();
        }
    }, 3000);
}

