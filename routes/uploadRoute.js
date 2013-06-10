var mysql = require('mysql');
var url = require("url");
var https = require('https');
var util = require('util');
var fs = require('fs');
var transaction =  require('node-mysql-transaction');
var schedule = require('node-schedule');
var twilio = require('twilio');


var connection = mysql.createConnection({
    host:'54.214.246.103',
    port:3306,
    user:'travler',
    password:'time',
    database:'TimeDB'
});


exports.upload = function(req, res){
    //console.log('req.body'+util.inspect(req.body));

    //console.log('req.body.friends : '+ req.body.friendsId);
    //console.log('reqtitlelength'+req.body.title.length);
    //console.log('req.files'+req.files);
    //console.log('-> upload was called\n\n');
    var images = [];
    var isImage = false;

    connection.query('UPDATE capsule SET capsule_title = ? , bury_flag = true, contacts = ?, START_DATE = CURDATE() WHERE CAPSULE_ID=?', [req.body.CapsuleTitle, parseInt(req.body.userContact), parseInt(req.body.cId)], function(err,results,fields){
        if(err) throw err;
    });

    connection.query('INSERT INTO user (USERID, CAPSULE_ID) VALUES (?,?)',[req.session.auth.facebook.user.id, parseInt(req.body.cId)], function(err,results3,fields){
        if(err) throw err;       
    });

    if(req.body.title != null ||req.body.title != undefined){
        //2개이상오면 배열. 구분해서 Text INsert
        if(Array.isArray(req.body.title)){
            for(var i=0; i<req.body.title.length; i++){
                connection.query('INSERT INTO contents (CAPSULE_ID, CONTENT_TYPE, TEXT_TITLE, TEXT_CONTENTS) VALUES (?,"text",?,?)',[parseInt(req.body.cId),req.body.title[i], req.body.contents[i]], function(err,results,fields){
                    
                    if(err) throw err;
                });
            };    
        }else{
            connection.query('INSERT INTO contents (CAPSULE_ID, CONTENT_TYPE, TEXT_TITLE, TEXT_CONTENTS) VALUES (?,"text",?,?)',[parseInt(req.body.cId),req.body.title, req.body.contents], function(err,results,fields){
                if(err) throw err;
            });
        };
    };

    if(req.body.friendsId != null ||req.body.friendsId != undefined){
        //2개이상오면 배열. 구분해서 친구 INsert
        if(Array.isArray(req.body.friendsId)){
            for(var i=0; i<req.body.friendsId.length; i++){
                connection.query('INSERT INTO user (USERID, CAPSULE_ID) VALUES (?,?)',[req.body.friendsId[i], parseInt(req.body.cId)], function(err,results3,fields){
                    
                    if(err) throw err;
                });
            };
        }else{
            connection.query('INSERT INTO user (USERID, CAPSULE_ID) VALUES (?,?)',[req.body.friendsId, parseInt(req.body.cId)], function(err,results3,fields){
                
                if(err) throw err;
            });
        };
    };

    //EXPRESS.BODYPARSER 는 MULTIPART 를 위해 REQ.FILES를 만들어 줍니다.
    //클라이언트에서 MUTIPLE로 요청시 여러파일이 올라오기 때문에 ARRAY인지 확인해 줍니다.
    if (Array.isArray(req.files.imgs)){

        req.files.imgs.forEach(function(image){
            var kb = image.size / 1024 | 0;
            //파일의 타입을 확인합니다.
            isImage = checkType(image);
            images.push({name: image.name, size: kb, isImage: isImage});
            //임시명으로 만들어진 파일의 이름을 바꿉니다.
            renameImg(req,image);
            //console.log('->> isImage: ' + isImage );
        });  
    }else{
        var image = req.files.imgs;
        var kb = image.size / 1024 | 0;
        isImage = checkType(image);
        images.push({name: image.name, size: kb, isImage: isImage});
        renameImg(req,image);
        //console.log('->> isImage: ' + isImage );
    };
     
    //console.log('->> render');


    connection.query('select start_date, duration, contacts from capsule where capsule_id = ?',[parseInt(req.body.cId)], function(err,results5,fields){
        if(err) throw err;

        var date2 = new Date(results5[0].start_date);
        date2.setHours(0);
        date2.setMinutes(0);
        var duration = results5[0].duration*24*60*60*1000;
        var openDate = new Date(date2.getTime() + duration);
        openDate.setHours(0);
        openDate.setMinutes(0);
        var openDateTostring = openDate.toString("yyyyMMdd");
        


        console.log(openDate +  " : openDateTostring");
        console.log(openDateTostring +  " : openDateTostring");
        

        var curDate = new Date();
        var tempDate = new Date (curDate.getTime() + 1*60*1000);

        var j = schedule.scheduleJob(openDate, function(){
            var client = new twilio.RestClient('AC9b69cfb44753501a6391a12248328b22', '002fc1ac5a329cdf47a2928fc8377329');
             
            // Pass in parameters to the REST API using an object literal notation. The
            // REST client will handle authentication and response serialzation for you.
            var text = '';
                text += '-Time Travler-\n';
                text += req.session.auth.facebook.user.name;
                text += '님의 타입캡슐 기간이 만료되었습니다.';
                text += '어서 가서 개봉해주세요!!';
            client.sms.messages.create({
                to:'+82'+results5[0].contacts,
                from:'+16123459604',
                body:text
            }, function(error, message) {
                if (!error) {
                    console.log('Success! The SID for this SMS message is:');
                    console.log(message.sid);
             
                    console.log('Message sent on:');
                    console.log(message.dateCreated);
                }
                else {
                    console.log('Oops! There was an error.');
                }

                console.log(text);
                res.render('admin', {title: 'Admin Page'});

                });
        });
        res.redirect("/");
    });
}; 
function checkType(image){
    var isImage = false;
    //console.log('->> image.type.indexOf : ' + image.type.indexOf('image'));
    //파일의 타입 비교
    if(image.type.indexOf('image') > -1){
        //console.log('->>> req.files.img is img');
        isImage = true;
    }else{
        //console.log('->>> req.files.img is not img');
        isImage = false;
    };
    return isImage;
}
 
function renameImg(req,image,callbock){
    console.log(image.type);
    var tmp_path = image.path;
    var target_path = './public/upload/' + image.name;
    //console.log('->> tmp_path: ' + tmp_path );
    //console.log('->> target_path: ' + target_path ); 
    //var ext = image.name.substring(image.name.lastIndexOf('.')+1,image.name.length);

    //TMP_PATH -> TARGET_PATH로 이동하면서 파일명을 바꿉니다.
    fs.rename(tmp_path, target_path, function(err){
        if(err) throw err;
            if(image.type.indexOf('image') > -1){
                connection.query('INSERT INTO contents (CAPSULE_ID, content_type, content_url) VALUES (?,"image",?)',[parseInt(req.body.cId),'/upload/'+image.name], function(err,results4,fields){
                    //console.log('imgbody: '+ image.name);
                    if(err) throw err;
                        
                });

            }else if(image.type.indexOf('video') > -1){
                connection.query('INSERT INTO contents (CAPSULE_ID, content_type, content_url) VALUES (?,"video",?)',[parseInt(req.body.cId), '/upload/'+image.name], function(err,results4,fields){
                    //console.log('mediabody : '+ image.name);
                    if(err) throw err;
                });
            }else if(image.type.indexOf('audio') > -1){
                connection.query('INSERT INTO contents (CAPSULE_ID, content_type, content_url) VALUES (?,"audio",?)',[parseInt(req.body.cId), '/upload/'+image.name], function(err,results4,fields){
                    //console.log('etcbody : '+ image.name);
                    if(err) throw err;
                });
            };
        /* 어떤 예제에서 아래와 같이 TMP_PATH를 다시 UNLINK해주지만 이미 RENAME으로 이동시켰기 때문에 TMP_PATH가 없다는 오류가 나게 됩니다.
        FS.UNLINK(TMP_PATH, FUNCTION() {
            IF (ERR) THROW ERR;
            RES.SEND('FILE UPLOADED TO: ' + TARGET_PATH + ' - ' + REQ.FILES.THUMBNAIL.SIZE + ' BYTES');
        });*/
        console.log('->> upload done');
    });
}

exports.cTypeUpload = function(req,res){
    var images = [];
    var isImage = false;

    var image = req.files.imgs;
    var kb = image.size / 1024 | 0;
    images.push({name: image.name, size: kb, isImage: isImage});
    renameImgForCapsuleType(req,res,image);
}

function renameImgForCapsuleType(req,res,image){
    console.log(image.type);
    var tmp_path = image.path;
    var target_path = './public/img/' + image.name;
    //console.log('->> tmp_path: ' + tmp_path );
    //console.log('->> target_path: ' + target_path ); 
    
    fs.rename(tmp_path, target_path, function(err){
        if(err) throw err;
        //console.log('->> req.body.CapsuleKind: ' + req.body.CapsuleKind );
        //console.log('->> req.body.CapsuleSize: ' + req.body.CapsuleSize );
        //console.log('->> image.name: ' + image.name );
        connection.query('INSERT INTO capsule_type (kind,size,img) values (?,?,?)', [req.body.CapsuleKind, parseInt(req.body.CapsuleSize), image.name], function(err,results,fields){
            if(err) throw err;
            //console.log('->> cType upload done');
            res.render('admin', {title: 'Admin Page'});
        })
        
    });
}
