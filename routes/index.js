
/*
 * GET home page.
 */

var mysql = require('mysql');
var url = require("url");
var https = require('https');
var util = require('util');
var fs = require('fs');
var twilio = require('twilio');
var transaction =  require('node-mysql-transaction');

var trCon = transaction({
    connection: [mysql.createConnection,{
        host:'54.214.246.103',
        port:3306,
        user:'travler',
        password:'time',
        database:'TimeDB'
    }],
    staticConnection : 1,
    dynamicConnection : 1,
    timeOut:10000
});

var chain = trCon.chain();

chain.on('commit', function(){
    console.log('number commit');
}).on('rollback', function(err){
        console.log(err);
});

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
    connection.query('INSERT INTO torder(order_date,refund_flag,method,userid) VALUES(curdate(),false,\'credit\',?)',[req.session.auth.facebook.user.id],function(err, result){
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
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule NATURAL JOIN user NATURAL JOIN torder WHERE userid = ? and bury_flag = true LIMIT ?,?',[req.session.auth.facebook.user.id,(req.params.page-1)*8,8],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule NATURAL JOIN user WHERE userid = ? and bury_flag = true',[req.session.auth.facebook.user.id],function(err, results2, fields){
            var pathNum = req.params.page;
            var previous = pathNum-1?(pathNum-1):'#';
            var next = pathNum == Math.ceil(results2[0].total/8)?'#':parseInt(pathNum)+1;
            res.json({results: results ,previous: previous ,next: next});
        });
    });
};

exports.reqfund = function(req, res){
    connection.query('UPDATE torder SET refund_flag=true WHERE order_id = ?',[req.query.order_id],function(err, results, fields){
        if(err) throw err;
        res.send('<html><head></head><body><script>alert("환불 요청되었습니다.");location.href="/";</script></body></html>');
    });
};

exports.orderPaging = function(req, res){
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule NATURAL JOIN torder WHERE userid = ? and bury_flag = false LIMIT ?,?',[req.session.auth.facebook.user.id,(req.params.page-1)*4,4],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule NATURAL JOIN torder WHERE userid = ? and bury_flag = false',[req.session.auth.facebook.user.id],function(err, results2, fields){
            const pagingNum = 5;
            const contentNum = 4;
            var pathNum = req.params.page;
            var currPageBlock = Math.ceil(pathNum/pagingNum);
            var previous = (currPageBlock-1)*pagingNum;
            var maxPageBlock = Math.ceil(Math.ceil(results2[0].total/contentNum)/pagingNum);
            maxPageBlock = maxPageBlock?maxPageBlock:1;
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

exports.showPaging = function(req, res){
    connection.query('SELECT * FROM user WHERE capsule_id = ? and userid = ?',[req.params.capsule_id,req.session.auth.facebook.user.id],function(err, results, fields){
        if(err) throw err;
        if(results[0] != undefined){
            connection.query('SELECT * FROM contents WHERE capsule_id = ? LIMIT ?,?',[req.params.capsule_id,(req.params.page-1)*8,8],function(err, results, fields){
                if(err) throw err;
                connection.query('SELECT COUNT(*) as total FROM contents WHERE capsule_id = ?',[req.params.capsule_id],function(err, results2, fields){
                    if(err) throw err;
                    var pathNum = req.params.page;
                    var previous = pathNum-1?(pathNum-1):'#';
                    var next = pathNum == Math.ceil(results2[0].total/8)?'#':parseInt(pathNum)+1;
                    res.json({results: results ,previous: previous ,next: next});
                });
            });
        }else{
            res.send(404,'Not Found');
        }
    });
};


exports.buryView = function(req, res){
  var queryData = url.parse(req.url, true).query;
    console.log('qd cid:: ' +queryData.capsule_id);
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
      connection.query('select size, duration from capsule_type NATURAL JOIN capsule where capsule_id=?',[queryData.capsule_id],function(err, result){
        console.log(util.inspect(result)+'whit the hell');
        res.render('bury', { title: 'Express', results:result, fbFriends: JSON.parse(fullData),fbFriends2: fullData, capsule_id :queryData.capsule_id });
      });
    });
    
  });
};

exports.admin = function(req,res){
  res.render('admin', {title: 'Admin Page'});
}

exports.refundPaging = function(req, res){
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule Natural JOIN torder WHERE bury_flag = true and refund_flag = true LIMIT ?,?',[(req.params.page-1)*8,8],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule NATURAL JOIN torder WHERE bury_flag = true and refund_flag = true',function(err, results2, fields){
            var pathNum = req.params.page;
            var previous = pathNum-1?(pathNum-1):'#';
            var next = pathNum == Math.ceil(results2[0].total/8)?'#':parseInt(pathNum)+1;
            res.json({results: results ,previous: previous ,next: next});
        });
    });
};


exports.refund = function(req,res){
    var queryData = url.parse(req.url, true).query;
    console.log(queryData.capsule_id +"<------------------ForReFundCapsule_id");
    console.log(queryData.contact +"<------------------contacts");
    connection.query('update torder a  set a.refund_flag = false where a.order_id = (select order_id from capsule where capsule_id=?)',[(queryData.capsule_id)],function(err, results, fields){
        if(err) throw err;
        var client = new twilio.RestClient('AC9b69cfb44753501a6391a12248328b22', '002fc1ac5a329cdf47a2928fc8377329');
         
        // Pass in parameters to the REST API using an object literal notation. The
        // REST client will handle authentication and response serialzation for you.
        var text = '';
            text += '-Time Travler-\n';
            text += req.session.auth.facebook.user.name;
            text += '님의 타입캡슐이 환불 되었습니다.';
        client.sms.messages.create({
            to:'+82'+queryData.contact,
            from:'+16123459604',
            body:text
        }, function(error, message) {
            
            // The HTTP request to Twilio will run asynchronously.  This callback
            // function will be called when a response is received from Twilio
            
            // The "error" variable will contain error information, if any.
            // If the request was successful, this value will be "falsy"
            if (!error) {
                
                // The second argument to the callback will contain the information
                // sent back by Twilio for the request.  In this case, it is the
                // information about the text messsage you just sent:
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
}

exports.sendSMS = function(req,res){
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('AC9b69cfb44753501a6391a12248328b22', '002fc1ac5a329cdf47a2928fc8377329');
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
var text = '';
    text += '-Time Travler-\n';
    text += req.session.auth.facebook.user.name;
    text += '님의 타입캡슐 기간이 만료되었습니다.';
    text += '어서 가서 개봉해주세요!!';
client.sms.messages.create({
    to:'+821025429381',
    from:'+16123459604',
    body:text
}, function(error, message) {
    
    // The HTTP request to Twilio will run asynchronously.  This callback
    // function will be called when a response is received from Twilio
    
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request.  In this case, it is the
        // information about the text messsage you just sent:
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
}
