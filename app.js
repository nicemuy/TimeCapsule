
/**
 * Module dependencies.
 */

function requireLogin(req, res, next) {
    if (req.session.auth != undefined?req.session.auth.loggedIn:false) {
        next();
    } else {
        res.redirect("/guest");
    }
}

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , uploadRoute = require('./routes/uploadRoute')
  , http = require('http')
  , path = require('path')
  , everyauth = require('everyauth')
  , io = require('socket.io')
  , map = require('./public/s_js/map.js').Map
  , player = require('./public/s_js/player.js').Player
  , chat = require('./public/s_js/chat.js').Chat
  , Minigame = require('./public/s_js/minigame.js').Minigame;

var app = express();

map.init();
var usersById = {};
var usersByFbId = {};

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth
  .facebook
    .appId(614025195292051)
    .appSecret('3d329dc308b8ae6b64ff579723c6f921')
    .findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = fbUserMetadata);
    })
    .redirectPath('/');
  
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.limit('20mb'));
app.use(express.bodyParser({uploadDir: __dirname + '/tmp'}));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req, res, next) {
  res.locals.session = req.session;
  if(req.url.search('^/purchase$') != -1){
      res.locals.menu = 'purchase';
  }else if(req.url.search('^/$') != -1){
      res.locals.menu = 'my';
  }else{
      res.locals.menu = '';
  }
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//페북을 위한 미들웨어 사용
app.use(everyauth.middleware());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/guest', routes.guest);
app.all('/', requireLogin);
app.get('/', routes.index);
app.all('/purchase', requireLogin);
app.get('/purchase', routes.purchase);
app.post('/purchase', routes.purchasePost);
app.all('/show', requireLogin);
app.get('/show', routes.show);
app.all('/users', requireLogin);
app.get('/users', user.list);
app.all('/minigame', requireLogin);
app.get('/minigame', routes.minigame);
app.get('/indexPaging/:page', routes.indexPaging);
app.get('/purchasePaging/:page', routes.purchasePaging);
app.get('/orderPaging/:page', routes.orderPaging);
app.get('/success/:c_id', routes.success);
app.all('/buryView', requireLogin);
app.get('/buryView', routes.buryView);
app.post('/upload', uploadRoute.upload);
app.get('/admin', routes.admin);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server);

io.sockets.on('connection', function (socket) {
  
  socket.emit('init', { map : map.get_Arr()});

  socket.on('hello', function (data) {
    Minigame.hello(data,socket);
  });
  
  socket.on('move', function (data) {
    Minigame.move(data,io,player);
  });

  socket.on('attack', function (data) {
    Minigame.attack(data,io,player);
  });

  socket.on('chat', function (data) {
    Minigame.chat(data,io,player);
  });

  socket.on('hit', function (data) {
    Minigame.hit(data,io,map);
  });

  socket.on('last_hit', function (data) {
    Minigame.last_hit(data,io,map);
  });

  socket.on('clear', function (data) {
    Minigame.clear(data,socket);
    map.init();
  });
});
