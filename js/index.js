// 京东轮播图
;(function(){
   var ul=document.querySelector(".jd_banner ul");
   var lis=ul.children;
   var liWidth=lis[0].offsetWidth;
   var olLis=document.querySelectorAll(".jd_banner ol li");
   
   
  //  最前面和最后面都有一张假图片，总数多2，最开始显示实际从第二张开始
  //  所以索引从1开始  0是假的图片，最后一张
  var index=1;
  var timeId=setInterval(function(){
    index++;
    addTransition();
    setTranslateX(-index*liWidth);    
  },3000);
  
  ul.addEventListener("transitionend",function(){
    //  如果到了最后一张图片的时候迅速切换到第一张
     if(index>=lis.length-1){
      index=1;       
     }   
   
    // 屏幕滑动的时候可以向左滑动，也可以向右滑动，所以，需要把右边也写出来
    // 到向右边滑动时候，到第一张假图时候，瞬间切换到最后一张真图。
    if(index<=0){
       index=lis.length-2;
      }
      removeTransition();       
      setTranslateX(-liWidth*index);  

     olLis.forEach(function(v,i){
         v.classList.remove("now");
     })
    //  当前的索引从1开始，ol li 的下标为0-7所以-1
     olLis[index-1].classList.add("now");
  })




  // 很多个地方会用到，为了避免动画冗余
  // 设置 过渡 动画
 function addTransition(){
    ul.style.transition="all .2s";
    ul.style.webkitTransition="all .2s";   
 }
// 重置动画
function removeTransition(){
    ul.style.transition="none";
    ul.style.webkitTransition="none";   
}
// 设置ul的位置
function setTranslateX(value){
   ul.style.transform="translateX("+value+"px)";
   ul.style.webkitTransform="translateX("+value+"px)";
}


  /*
  * 需求:
  *   (1) 手指在屏幕滑动, ul 跟着一起滑
  *   (2) 手指滑动, 离开屏幕时, 判断左滑动还是右滑动
  *   (3) 添加快速滑动效果, 短时间进行一定距离的滑动
  *       在 300ms 内, 滑动距离 > 50, 可以切换
  *
  * 思路:
  *   (1) 在touchstart中记录开始滑动的位置, 清除定时器
  *   (2) 在touchmove中, 计算手指滑动的位移, 在原有的位置基础上, 实时将位移设置给 ul
  *   (3) 在touchend中, 计算手指滑动的位移, 根据位移进行判断
  *       1. 如果向右滑动距离超过 1/3, 右滑动, 显示上一张, index--;
  *       2. 如果向左滑动距离超过 1/3, 左滑动, 显示下一张, index++;
  *       3. 如果滑动距离在 1/3内, 归位, index不变;
  * */
   
  // 添加手指事件
   var startX=0;
   var startTime;
   
  //  手指开始触摸时候的坐标-离开时的坐标=滑动的距离
  //  事件参数对象E 中存储了，触摸事件。
  //  触摸开始——————————————
   ul.addEventListener("touchstart" ,function(e){
      startX=e.touches[0].clientX;
      startTime=new Date();     
      clearInterval(timeId); 

   })


  // 滑动的时候————————————————
   ul.addEventListener("touchmove",function(e){
       var distanceX=e.changedTouches[0].clientX-startX;
      //  让ul跟手指动
      removeTransition();
      //  设置ul跟随手指移动的距离,ul移动的距离是原本的位置加移动的距离
      setTranslateX(distanceX+(-index*liWidth));
   })


  // 手指离开的时候——————————————
   ul.addEventListener("touchend",function(e){
       var distanceX=e.changedTouches[0].clientX-startX;
      // 手指离开的时候，如果滑动距离大于图片的1/3 ，就切换的前一张
       var endTime=new Date();
       var time=endTime-startTime;

       if(distanceX>liWidth/3||(time<300&&distanceX>50)){
          index--;
       }else if(distanceX<-liWidth/3||(time<300&&distanceX>50)){
          index++;
       }

      removeTransition();
      setTranslateX(distanceX+(-index*liWidth));

     timeId = setInterval(function(){
          index++;
          addTransition();
          setTranslateX(-index*liWidth);
       },3000)
   }) 
  //  每一张图片也就是 liWidth 需要重新获取，不然每次都是获取的初始状态宽度
  window.addEventListener("resize",function(){
     liWidth=lis[0].offsetWidth;
    //  重新获取到之后需要重新渲染，不需要过渡动画
      removeTransition();
      setTranslateX(- index*liWidth);
  })
})();




//  动态获取每个 li  的宽度给 ul
;(function(){
    var lis=document.querySelectorAll(".jd_secKill_content ul li");
   var liWidth=lis[0].offsetWidth;
   var ul=document.querySelector(".jd_secKill_content ul");
   ul.style.width=liWidth*lis.length+"px";
})();





// 给秒杀内容添加 水平方向的 回弹效果
;(function(){
    // 构造IScroll 类，第一个参数为选择器，第二个参数是对象
    new IScroll(".jd_secKill_content",{
        scrollX:true,
        scrollY:false
    });   
})();


// 动态监听鼠标滚动事件，给头部设置背景透明度
;(function(){
     var header=document.querySelector(".jd_header");
     window.addEventListener("scroll",function(){
          var scrollY=window.pageYOffset;
          var opacity=0;
          if(scrollY>=400){
              opacity=0.9;
          }else{
             opacity=scrollY/400*0.9;
          }
          header.style.backgroundColor="rgba(222,24,27,"+opacity+")";
     })
})();



//设置京东快报部分  消息向上滚动
;(function(){
     var info=document.querySelector(".jd_news .info");
     var ul=document.querySelector(".jd_news .info ul");;
     var lis=document.querySelectorAll(".jd_news .info ul li");
     var liHeight=lis[0].offsetHeight;     
     var index=0;
     setInterval(function(){
         index++;
         ul.style.transition="all 0.5s";
         ul.style.transform="translateY("+(-index*liHeight)+"px)";
     },1000);

     ul.addEventListener("transitionend",function(){
          if(index>=lis.length-1){
               index=0;
               ul.style.transition="none";
               ul.style.transform="translateY(0px)";
          }
     })
     
})();


// 倒计时
;(function(){
     var  hour=document.querySelector(".jd_secKill .time .hour");
     var  minutes=document.querySelector(".jd_secKill .time .minutes");
     var  seconds=document.querySelector(".jd_secKill .time .seconds");

     function addZero(n){
          return n<10?"0"+n:n;
     }
     function setTime(){     
             var time=new Date("2018/11/11 20:53");
            var now=new Date();       
            time=(time-now)/1000;

            if(time<=0){
               time=0;
                clearInterval(timeId);
             }

            var h=parseInt(time/3600);
            var m=parseInt(time/60%60);
            var s=parseInt(time%60);
            
            hour.innerHTML=addZero(h);
            minutes.innerHTML=addZero(m);
            seconds.innerHTML=addZero(s);
     }
  
     setTime();
    var timeId = setInterval(setTime,1000)
     
     


})();