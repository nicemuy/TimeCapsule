
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
  connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = true LIMIT ?,?',[(req.params.page-1)*8,8],function(err, results, fields){
    if(err) throw err;
    var pathNum = parseInt(path.substring(1));
    var previous = pathNum-1?'/'+(pathNum-1):'#';
    var next = pathNum+1;
    res.render('index', { title: 'Express' ,session: req.session ,results: results ,path: req.path});
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