function purchasePaging(page){
    var loading = $('<div style="text-align:center"><img alt="loading" src="/img/ajax-loader.gif"/></div>').prependTo('.item-list:not(.logos)').hide();
    $(document).bind('ajaxStart.purchase',function(){
        $('.item-list ul').html('');
        loading.show();
    });
    $(document).bind('ajaxStop.purchase',function(){
        loading.hide();
        $(document).unbind('.purchase');
    });

    $.get('/purchasePaging/'+page,function(data){
        for(index in data.results){
            var buryItem = $('<li></li>');
            $('<img/>',{
                src:'/img/'+data.results[index].img,
                alt:'캡슐',
                class:'pop img-polaroid'
            }).appendTo(buryItem);

            var fctl = $('<div class="form-controls"></div>');

            $('<div class="input-append"></div>').append($('<input>',{
                style:'width:33px',
                pattern:'^[1-9][0-9]*',
                title:'숫자만 입력하세요',
                maxlength:4,
                name:'duration',
                type:'text',
                id:'day'+index
            })).append('<span class="add-on">일</span>').appendTo(fctl);

            $('<div class="input-append"></div>').append($('<input>',{
                style:'width:15px',
                pattern:'^[1-9][0-9]*',
                title:'숫자만 입력하세요',
                maxlength:2,
                name:'count',
                type:'text',
                id:'count'+index
            })).append('<span class="add-on">개</span>').appendTo(fctl);

            fctl.appendTo(buryItem);

            $('<div class="submits"></div>').append($('<button></button>',{
                class:'btn btn-mini btn-primary',
                value:index,
                text:'구매',
                click:(function(){
                    var idx = index;
                    return function(){
                        var tForm = $('<form></form>').attr('action','/purchase').attr('method','post');
                        tForm.append($('#day'+this.value).clone());
                        tForm.append($('#count'+this.value).clone());
                        tForm.append($('<input/>',{
                            type:'text',
                            value: data.results[idx].kind,
                            name:'kind'
                        }));
                        $('#dummy').submit(function(){
                            tForm.submit();
                            return false;
                        });
                    };
                })()
            })).appendTo(buryItem);
            /*
                .append($('<button></button>',{
                class:'btn btn-mini btn-success',
                value:index,
                text:'담기',
                click:function(){
                    var tForm = $('<form></form>').attr('action','/wishlist').attr('method','post');
                    tForm.append($('#day'+this.value).clone());
                    tForm.append($('#count'+this.value).clone());
                    tForm.append($('<input/>',{
                        type:'text',
                        value: data.results[index].kind,
                        name:'kind'
                    }));
                    $('#dummy').submit(function(){
                        tForm.submit();
                        return false;
                    });
                }
            })).appendTo(buryItem);*/

            $('<div></div>',{
                id:'title'+index,
                style:'display:none',
                text:data.results[index].kind
            }).appendTo(buryItem);

            $('<div></div>',{
                id:'pop'+index,
                style:'display:none',
                text:data.results[index].size+'MB'
            }).appendTo(buryItem);

            if(index<3){
                $($('.item-list ul')[0]).append(buryItem);
            }else if(index >=3 && index<6){
                $($('.item-list ul')[1]).append(buryItem);
            }
        }
        $('a.arrow-left').attr('onclick','purchasePaging('+data.previous+')');
        $('a.arrow-right').attr('onclick','purchasePaging('+data.next+')');

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
    });
}

$(function(){
    purchasePaging(1);
});