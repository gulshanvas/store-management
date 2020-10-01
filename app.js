const express = require('express');
const baseRoute = require('./routes/index');
// const CookieHelper = require('./lib/CookieHelper');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const cors = require('cors');

const app = express();


app.use(cors({
  credentials: true,
  origin: true
}));
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(CookieHelper.parseLoginCookie);

app.use('/api', baseRoute);

app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || '127.0.0.1');

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('host') + ':' + app.get('port'));
});