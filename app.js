
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , everyauth = require('everyauth');

var app = express();

var usersByFbId = {};
var nextUserId = 0;

everyauth
  .facebook
    .appId(614025195292051)
    .appSecret('3d329dc308b8ae6b64ff579723c6f921')
    .findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = fbUserMetadata);
    })
    .redirectPath('/1');

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });
  
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//페북을 위한 미들웨어 사용
app.use(everyauth.middleware());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/guest', routes.guest);
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/minigame', routes.minigame);
app.get('/indexPaging/:page', routes.indexPaging);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
