function pause()
{
    $.jPlayer.pause();
}

function changeVideo(video,title){
    $("#jquery_jplayer_0").jPlayer("setMedia", {
        m4v: video
    });
    $('#videoModalLabel').text(title);
}

function changeAudio(audio,title){
    $("#jquery_jplayer_1").jPlayer("setMedia", {
        mp3: audio
    });
    $('#audioModalLabel').text(title);
}

function changeImage(image,title){
    $('#imageModalLabel').text(title);
    $('#imageModal .modal-body img').attr('src',image);
}

function changeText(text,title){
    $('#textModalLabel').text(title);
    $('#textModal .modal-body').text(text);
}

function showPaging(capsule_id,page){
    var loading = $('<div style="text-align:center"><img alt="loading" src="/img/ajax-loader.gif"/></div>').prependTo('.show-list:not(.logos)').hide();
    $(document).bind('ajaxStart.show',function(){
        $('.show-list ul').html('');
        loading.show();
    });
    $(document).bind('ajaxStop.show',function(){
        loading.hide();
        $(document).unbind('.show');
    });

    $.get('/showPaging/'+capsule_id+'/'+page,function(data){
        for(index in data.results){
            var showItem = $('<li></li>');

            var type;
            var src;
            var name;
            var func;

            if(data.results[index].content_type == 'text'){
                type = '#textModal';
                src = '/img/text.png';
                name = data.results[index].text_title;
                func = changeText.bind(func,data.results[index].content_url,data.results[index].text_title);
            }else if(data.results[index].content_type == 'image'){
                type = '#imageModal';
                src = '/img/picture.png';
                name = data.results[index].content_url.substr(8);
                func = changeImage.bind(func,data.results[index].content_url,data.results[index].content_url.substr(8));
            }else if(data.results[index].content_type == 'audio'){
                type = '#audioModal';
                src = '/img/audio.png';
                name = data.results[index].content_url.substr(8);
                func = changeAudio.bind(func,data.results[index].content_url,data.results[index].content_url.substr(8));
            }else if(data.results[index].content_type == 'video'){
                type = '#videoModal';
                src = '/img/movie.png';
                name = data.results[index].content_url.substr(8);
                func = changeVideo.bind(func,data.results[index].content_url,data.results[index].content_url.substr(8));
            }

            $('<a></a>',{
                class:'btn content',
                href: type,
                role: 'button',
                'data-toggle':'modal',
                click: func
            }).append($('<div class="frame"></div>').append($('<img/>',{
                src: src,
                class: 'pop',
                alt: 'icon'
            }))).appendTo(showItem);

            $('<div class="text"></div>',{
                text:name
            }).appendTo(showItem);


            if(index<4){
                $($('.show-list ul')[0]).append(showItem);
            }else if(index >=4 && index<8){
                $($('.show-list ul')[1]).append(showItem);
            }
        }
        $('a.arrow-left').attr('onclick','showPaging('+capsule_id+','+data.previous+')');
        $('a.arrow-right').attr('onclick','showPaging('+capsule_id+','+data.next+')');
    });
}


$(document).ready(function(){
    $("#jquery_jplayer_0").jPlayer({
        cssSelectorAncestor: '#jp_container_0',
        swfPath: "/js",
        supplied: "m4v"
    });
    $("#jquery_jplayer_1").jPlayer({
        cssSelectorAncestor: '#jp_container_1',
        swfPath: "/js"
    });
    showPaging($.url().param('capsule_id'),1);
});