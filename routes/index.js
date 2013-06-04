
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
  connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = true LIMIT 0,8',function(err, results, fields){
    if(err) throw err;
    connection.query('SELECT COUNT(*) as total FROM capsule WHERE bury_flag = true',function(err, results2, fields){
        res.render('index', { title: 'Express' ,session: req.session ,results: results ,previous: '#' ,next: '#'});
    });
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

exports.indexPaging = function(req, res){
    connection.query('SELECT * FROM capsule_type NATURAL JOIN capsule WHERE bury_flag = true LIMIT ?,?',[(req.params.page-1)*8,8],function(err, results, fields){
        if(err) throw err;
        connection.query('SELECT COUNT(*) as total FROM capsule WHERE bury_flag = true',function(err, results2, fields){
            var pathNum = parseInt(req.path.substring(1));
            var previous = pathNum-1?'/'+(pathNum-1):'#';
            var next = pathNum == Math.ceil(results2[0].total/8)?'#':'/'+(pathNum+1);
            res.json({results: results ,previous: previous ,next: next});
        });
    });
};