function pause()
{
    $.jPlayer.pause();
}

function showPaging(page){
    var loading = $('<div style="text-align:center"><img alt="loading" src="/img/ajax-loader.gif"/></div>').prependTo('.show-list:not(.logos)').hide();
    $(document).bind('ajaxStart.bury',function(){
        $('.show-list ul').html('');
        loading.show();
    });
    $(document).bind('ajaxStop.bury',function(){
        loading.hide();
        $(document).unbind('.bury');
    });

    $.get('/showPaging/'+page,function(data){
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
        $('a.arrow-left').attr('onclick','showPaging('+data.previous+')');
        $('a.arrow-right').attr('onclick','showPaging('+data.next+')');
    });
}


$(document).ready(function(){
    $("#jquery_jplayer_0").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                m4v: "/upload/movie.mp4"
            });
        },
        cssSelectorAncestor: '#jp_container_0',
        swfPath: "/js",
        supplied: "m4v"
    });
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "/upload/bluesky.mp3"
            });
        },
        cssSelectorAncestor: '#jp_container_1',
        swfPath: "/js"
    });
});