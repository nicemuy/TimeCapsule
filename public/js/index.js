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
                        href:'/minigame',
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

function orderPaging(page){
    var loading = $('<div style="text-align:center"><img alt="loading" src="/img/ajax-loader.gif"/></div>').prependTo('.bought').hide();
    $(document).bind('ajaxStart.order',function(){
        $('.bought>ul').html('');
        $('.bought div ul').html('');
        loading.show();
    });
    $(document).bind('ajaxStop.order',function(){
        loading.hide();
        $(document).unbind('.order');
    });

    $.get('/orderPaging/'+page,function(data){
        for(index in data.results){
            var orderItem = $('<li></li>');

            $('<img/>',{
                src:'/img/'+data.results[index].img,
                alt:'캡슐'
            }).appendTo(orderItem);

            $('<div class="bury"></div>').append($('<a></a>',{
                class:'btn btn-mini',
                text:'묻기',
                href:'#'
            })).appendTo(orderItem);

            $('.bought>ul').append(orderItem);
        }

        //Prev 추가
        $('<li></li>',{
            class:function(){
                if(data.previous == 0)
                    return 'disabled';
                else
                    return '';
            }
        }).append($('<a></a>',{
            click:function(){
                if(data.previous == 0)
                    return;
                else
                    orderPaging(data.previous);
            },
            text:'Prev'
        })).appendTo('.bought div ul');

        for(var i=data.previous+1;i<=data.endPage;i++){
            var pageItem = $('<li></li>',{
                class: function(){
                    if(i == page)
                        return 'active';
                    else
                        return '';
                }
            });

            $('<a></a>',{
                click:(function(){
                        var idx = i;

                        if(i == page)
                            return;
                        else
                            return function(){
                                orderPaging(idx);
                            };
                })(),
                text:i
            }).appendTo(pageItem);
            $('.bought div ul').append(pageItem);
        }

        //Next 추가
        $('<li></li>',{
            class:function(){
                if(data.next == 0)
                    return 'disabled';
                else
                    return '';
            }
        }).append($('<a></a>',{
            click:function(){
                if(data.next == 0)
                    return;
                else
                    orderPaging(data.next);
            },
            text:'Next'
        })).appendTo('.bought div ul');
    });
}

$(function(){
    indexPaging(1);
    orderPaging(1);
});