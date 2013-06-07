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
                href:'/buryView?capsule_id='+data.results[index].capsule_id
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
    orderPaging(1);
});