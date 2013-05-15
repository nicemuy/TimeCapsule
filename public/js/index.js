$(function(){
    /*$(".pop").each(function(index){
       $(this).popover({
           trigger:'hover',
           title:'test',
           html:true,
           content:function(){
               return $("#pop"+index).text();
           }
       });
    });*/
    
    $(".pop0").popover({
           trigger:'hover',
           title:'2005년 친구들과 청계천에서',
           html:true,
           content:function(){
               return $("#pop0").text();
           }
       });
    $(".pop1").popover({
           trigger:'hover',
           title:'우리결혼식날! 1000일 뒤에 보면 색다르겠지?',
           html:true,
           content:function(){
               return $("#pop1").text();
           }
       });
    $(".pop2").popover({
           trigger:'hover',
           title:'엽기사진, 200일뒤에 봐라!!',
           html:true,
           content:function(){
               return $("#pop2").text();
           }
       });
    $("div.progress").tooltip({placement:'bottom',delay:{show:300,hide:100}});
});