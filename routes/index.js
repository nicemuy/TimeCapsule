
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
        res.render('index', { title: 'Express' ,session: req.session});
};

exports.purchase = function(req, res){
    res.render('purchase/index');
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
      res.render('bury', { title: 'Express', fbFriends: JSON.parse(fullData),fbFriends2: fullData, capsule_id :queryData.capsule_id });
    });
    
  });
};
