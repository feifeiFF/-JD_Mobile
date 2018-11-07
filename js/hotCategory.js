;(function(){
  //  区域滚动的需求
  // 1---手指滚动，子元素ul 跟手指动
  // 2---滑到底部或者顶部，设定一定的边界，让子元素ul回弹

  // 思路：
  // 1-- 注册手指事件 touchstart touchmove touchend 
  // 2-- touchstart 的时候记录手指开始位置
  // 3-- touchmove  的时候计算手指移动的距离（手指当前位置-手指开始位置）
  // 4-- 在tochmove 中计算移动了多少，更新ul移动的距离，移动的距离要在原有的基础上
  // 5-- 记录ul的位置，在 touchend  中，每一次手指移动的距离叠加就是ul的位置
 

  var  content_left=document.querySelector(".content_left");
  var  ul=document.querySelector(".content_left ul");
  var  lis=document.querySelectorAll(".content_left ul li");
 


  var startY=0;
  var currentY=0; //记录  ul  的当前位置



  ul.addEventListener("touchstart",function(e){

     startY=e.touches[0].clientY;
     console.log(startY);
  })

  ul.addEventListener("touchmove",function(e){
      var distanceY=e.touches[0].clientY-startY;       
      // ul  跟着手指滑动的时候，不需要过度动画
      ul.style.transition="none";
      //  ul 每一次移动的距离都是原有距离的基础之上的
      ul.style.transform="translateY("+(currentY+distanceY)+"px)"
  })


  ul.addEventListener("touchend",function(e){
      // 滑动结束的时候记录手指的位置
      var distanceY=e.changedTouches[0].clientY-startY;
      // 记录ul当前的位置，每一次叠加，就是ul当前的位置，往下是正数，上滑动是负数
        currentY+=distanceY;

      if(currentY>0){
         currentY=0;
         ul.style.transition="all .3s";
         ul.style.transform="translateY(0px)";  
      }
      // 最小的Y值界限是 子容器的实际高度 -  父容器的实际高度 ( 是滑动到上面的值，是负值 )
      var minY=-(ul.offsetHeight - content_left.offsetHeight);        
        if(currentY < minY){
            currentY=minY;
            ul.style.transition="all .3s";
            ul.style.transform="translateY("+minY+"px)";
        }
  

      
  })




  //  IScroll 插件使用注意事项（用于区域滚动）
  // 1.有一个有宽高的父容器
  // 2.必须有个可以溢出父容器的自容器，如果有多个子容器，只会对第一有效，对其余的忽略
  // 3 为了保证计算的准确，需要在容器子元素渲染完成，进行初始化
      // 1--放在  window.onload 事件中，onload事件会等待外部资源加载完毕
      // 2--如果有 ajax 请求，子元素是动态渲染的，在子元素完之后u，进行初始化

      window.addEventListener("load",function(){
        //  实例化需要区域滚动的父容器
        new IScroll(".content_right");

        // 还可以自定义回单效果的方向（默认纵向）
        // new IScroll(".content_right",{
        //    scrollX:true,  //横向的时子元素的宽度要溢出有宽高的父元素
        //    scrollY:false
        // });
      })
})();