
/*
 * GET home page.
 */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'54.214.246.103',
    port:3306,
    user:'travler',
    password:'time',
    database:'TimeDB'
});

exports.index = function(req, res){
  console.log(req.param.page);
  connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = true LIMIT 0,8',function(err, results, fields){
    if(err) throw err;
    res.render('index', { title: 'Express' ,session: req.session ,results: results});
  });
};

exports.guest = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('guest/main', { title: 'GuestMain'});
};

exports.minigame = function(req, res){
  //res.render('guest/main', { title: 'GuestMain', layout: 'guestLayout.jade' });
  res.render('minigame');
};