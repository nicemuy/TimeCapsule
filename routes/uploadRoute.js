var mysql = require('mysql');
var url = require("url");
var https = require('https');
var util = require('util');
var fs = require('fs');


exports.upload = function(req, res){    
    console.log('req.body'+util.inspect(req.body));
    console.log('reqtitlelength'+req.body.title.length);
    for(var i=0; i<req.body.title.length; i++){
        console.log('titleNEMA     : '+req.body.title[i]);
    }
    console.log('req.files'+req.files);
    console.log('-> upload was called\n\n');
    //console.log('-> util.inspect(req.files) : ' +  util.inspect(req.files));        
    var images = [];
    var isImage = false;
    //EXPRESS.BODYPARSER 는 MULTIPART 를 위해 REQ.FILES를 만들어 줍니다.
    //클라이언트에서 MUTIPLE로 요청시 여러파일이 올라오기 때문에 ARRAY인지 확인해 줍니다.
    if (Array.isArray(req.files.imgs)){
        req.files.imgs.forEach(function(image){
            var kb = image.size / 1024 | 0;
            //파일의 타입을 확인합니다.
            isImage = checkType(image);
            images.push({name: image.name, size: kb, isImage: isImage});
            //임시명으로 만들어진 파일의 이름을 바꿉니다.
            renameImg(image);
            console.log('->> isImage: ' + isImage );
        });  
    }else{
        var image = req.files.imgs;
        var kb = image.size / 1024 | 0;
        isImage = checkType(image);
        images.push({name: image.name, size: kb, isImage: isImage});
        renameImg(image);
        console.log('->> isImage: ' + isImage );
    }
     
    console.log('->> render');
    res.render('bury/show', { title: 'Show'
                            ,images: util.inspect(images)
    });
};
 
function checkType(image){
    var isImage = false;
    console.log('->> image.type.indexOf : ' + image.type.indexOf('image'));
    //파일의 타입 비교
    if(image.type.indexOf('image') > -1){
        console.log('->>> req.files.img is img');
        isImage = true;
    }else{
        console.log('->>> req.files.img is not img');
        isImage = false;
    }
    return isImage;
}
 
function renameImg(image){
    var tmp_path = image.path;
    var target_path = './public/upload/' + image.name;
    console.log('->> tmp_path: ' + tmp_path );
    console.log('->> target_path: ' + target_path );
    //TMP_PATH -> TARGET_PATH로 이동하면서 파일명을 바꿉니다.        
    fs.rename(tmp_path, target_path, function(err){
        if(err) throw err;
        /* 어떤 예제에서 아래와 같이 TMP_PATH를 다시 UNLINK해주지만 이미 RENAME으로 이동시켰기 때문에 TMP_PATH가 없다는 오류가 나게 됩니다.
        FS.UNLINK(TMP_PATH, FUNCTION() {
            IF (ERR) THROW ERR;
            RES.SEND('FILE UPLOADED TO: ' + TARGET_PATH + ' - ' + REQ.FILES.THUMBNAIL.SIZE + ' BYTES');
        });*/
        console.log('->> upload done');
    });
}

