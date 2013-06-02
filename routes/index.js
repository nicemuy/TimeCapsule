
/*
 * GET home page.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'travler',
    password:'time',
    database:'TimeDB'
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' ,session: req.session});
};

exports.guest = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('guest/main', { title: 'GuestMain'});
};

exports.minigame = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('minigame');
};

exports.dbtest = function(req, res){
    connection.query('SELECT * FROM capsule',function(err, results, fields){
        if(err) throw err;
        res.render('dbtest',{duration:results[0].duration});
    });
}