function indexPaging(page){
    $.get('/indexPaging/'+page,function(data){
        for(index in data.results){
            if(index<4){
                $('.item-list ul')[0].html('<li></li>').append('<img/>').attr('src','/img/'+data.results[index].img).attr('alt',data.results[index].img)
                    .after('<div></div>').filter('div').attr('id','title'+index).attr('style','display:none').text(data.results[index].kind)
                    .after('<div></div>');
            }
        }
    });
}
$(function(){
    $(".pop").each(function(index){
       $(this).popover({
           trigger:'hover',
           title:function(){
               return $("#title"+index).text();
           },
           html:true,
           content:function(){
               return $("#pop"+index).text();
           }
       });
    });
    $("div.progress").tooltip({placement:'bottom',delay:{show:300,hide:100}});
});