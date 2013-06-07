function indexPaging(page){
    var loading = $('<div style="text-align:center"><img alt="loading" src="/img/ajax-loader.gif"/></div>').prependTo('.item-list:not(.logos)').hide();
    $(document).bind('ajaxStart.bury',function(){
        $('.item-list ul').html('');
        loading.show();
    });
    $(document).bind('ajaxStop.bury',function(){
        loading.hide();
        $(document).unbind('.bury');
    });

    $.get('/indexPaging/'+page,function(data){
        for(index in data.results){
            var buryItem = $('<li></li>');
            $('<img/>',{
                src:'/img/'+data.results[index].img,
                alt:'캡슐',
                class:'pop'
            }).appendTo(buryItem);
            $('<div></div>',{
                id:'title'+index,
                style:'display:none',
                text:data.results[index].kind
            }).appendTo(buryItem);

            var curDate = new Date();
            var startDate = new Date(data.results[index].start_date);
            var perc = Math.floor(Math.ceil((curDate.getTime()-startDate.getTime())/(1000*60*60*24))/data.results[index].duration*100);
            perc = perc>100?100:perc;

            $('<div></div>',{
                id:'pop'+index,
                style:'display:none',
                text:data.results[index].size+'byte/'+data.results[index].duration+'일'
            }).appendTo(buryItem);

            if(perc == 100){
                $('<div></div>',{
                    title:'100%',
                    class:'progress progress-striped progress-success active'
                }).append($('<div></div>',{
                    style:'width:100%',
                    class:'bar'
                })).appendTo(buryItem);
                if(data.results[index].open_flag){
                    $('<a></a>',{
                        class:'btn btn-info btn-small',
                        href:'/show',
                        target:'_blank',
                        text:'열기'
                    }).appendTo(buryItem);
                }else{
                    $('<a></a>',{
                        class:'btn btn-success btn-small',
                        href:'/minigame?capsule_id='+data.results[index].capsule_id,
                        target:'_blank',
                        text:'찾기'
                    }).appendTo(buryItem);
                }
            }else{
                $('<div></div>',{
                    title:perc+'%',
                    class:'progress progress-striped active'
                }).append($('<div></div>',{
                    style:'width:'+perc+'%',
                    class:'bar'
                })).appendTo(buryItem);
            }

            if(index<4){
                $($('.item-list ul')[0]).append(buryItem);
            }else if(index >=4 && index<8){
                $($('.item-list ul')[1]).append(buryItem);
            }
        }
        $('a.arrow-left').attr('onclick','indexPaging('+data.previous+')');
        $('a.arrow-right').attr('onclick','indexPaging('+data.next+')');

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
}

$(function(){
    indexPaging(1);
});