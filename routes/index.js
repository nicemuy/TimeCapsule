
/*
 * GET home page.
 */

var mysql = require('mysql');
var url = require("url");
var https = require('https');
var util = require('util');
var fs = require('fs');


var connection = mysql.createConnection({
    host:'54.214.246.103',
    port:3306,
    user:'travler',
    password:'time',
    database:'TimeDB'
});

exports.index = function(req, res){
    res.render('index', { title: 'Express'});
};

exports.purchase = function(req, res){
    res.render('purchase/index');
}

exports.purchasePost = function(req, res){
    connection.query('INSERT INTO torder(order_date,refund_flag,method) VALUES(curdate(),false,\'credit\')',function(err, result){
        if(err) throw err;
        var insertId = result.insertId;
        var loopIndex = 0;
        for(var i=0;i<req.body.count;i++){
            connection.query('INSERT INTO capsule(start_date,duration,kind,open_flag,bury_flag,order_id) VALUES(null,?,?,false,false,?)',[req.body.duration,req.body.kind,insertId],function(err, result2){
                if(err) throw err;
                loopIndex++;
                if(loopIndex == req.body.count)
                    res.send('<html><head></head><body><script>alert("구매가 완료되었습니다.");location.href="/";</script></body></html>'); //바꺼야함
            });
        }
    });
}

exports.guest = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('guest/main', { title: 'GuestMain'});
};

exports.show = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('show', { title: 'show'});
};

exports.minigame = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  var queryData = url.parse(req.url, true).query;
  console.log(queryData.capsule_id +"<------------------url");
  res.render('minigame/huhu',{ name : req.session.auth.facebook.user.id, capsule_id : queryData.capsule_id });
};

exports.success = function(req, res){
    connection.query('update capsule set open_flag = true where capsule_id = ?',[(req.params.c_id)],function(err,results,fields){
        console.log("hahahahahahahahahahahahahahah ============ "+req.params.c_id);
        res.json({results: true});
    });
};

exports.indexPaging = function(req, res){
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = true LIMIT ?,?',[(req.params.page-1)*8,8],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule WHERE bury_flag = true',function(err, results2, fields){
            var pathNum = req.params.page;
            var previous = pathNum-1?(pathNum-1):'#';
            var next = pathNum == Math.ceil(results2[0].total/8)?'#':parseInt(pathNum)+1;
            res.json({results: results ,previous: previous ,next: next});
        });
    });
};

exports.orderPaging = function(req, res){
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = false LIMIT ?,?',[(req.params.page-1)*4,4],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule WHERE bury_flag = false',function(err, results2, fields){
            const pagingNum = 5;
            const contentNum = 4;
            var pathNum = req.params.page;
            var currPageBlock = Math.ceil(pathNum/pagingNum);
            var previous = (currPageBlock-1)*pagingNum;
            var maxPageBlock = Math.ceil(Math.ceil(results2[0].total/contentNum)/pagingNum);
            var next = currPageBlock == maxPageBlock?0:currPageBlock*pagingNum+1;
            var endPage = currPageBlock == maxPageBlock?Math.ceil(results2[0].total/contentNum)-previous:next;
            res.json({results: results ,previous: previous ,next: next ,endPage: endPage});
        });
    });
}

exports.purchasePaging = function(req, res){
    connection.query('SELECT * FROM capsule_type LIMIT ?,?',[(req.params.page-1)*6,6],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule_type',function(err, results2, fields){
            var pathNum = req.params.page;
            var previous = pathNum-1?(pathNum-1):'#';
            var next = pathNum == Math.ceil(results2[0].total/6)?'#':parseInt(pathNum)+1;
            res.json({results: results ,previous: previous ,next: next});
        });
    });
};


exports.buryView = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  var address = 'https://graph.facebook.com/'
          +req.session.auth.facebook.user.id+
          '/friends?access_token='+req.session.auth.facebook.accessToken;

  https.get(address, function(res1) {

    res1.setEncoding('utf8');
    var fullData = '';
    res1.on('data', function(d) {
      fullData += d;
    });

    res1.on('end', function(){
      res.render('bury', { title: 'Express', fbFriends: JSON.parse(fullData),fbFriends2: fullData});
    });
    
  });
};

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

