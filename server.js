const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const Cors = require('@koa/cors');
const BodyParser = require('koa-bodyparser');
const Helmet = require('koa-helmet');
const respond = require('koa-respond');
const mongoose = require('mongoose');

const app = new Koa()
const router = new Router()

app.use(Helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(Logger())
}

app.use(Cors())
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  strict: true,
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422)
  }
}))

app.use(respond())

// API routes
require('./routes')(router)
app.use(router.routes())

// serve compiled front-end
app.use(require('koa-static')('./build'))

app.use(router.allowedMethods())

// Connect to Mongodb
var dbUsername = process.env.MONGO_DB_USER;
var dbPassword = process.env.MONGO_DB_PASSWORD;
var dbHost = process.env.MONGODB_SERVICE_HOST;
var dbPort = process.env.MONGODB_SERVICE_PORT;
var dbName = process.env.MONGO_DB_DATABASE;
var connectionString = 'mongodb://' + dbUsername + ':' + dbPassword +'@' + dbHost + ':' + dbPort + '/' + dbName;
console.log('---DATABASE PARAMETERS---');
console.log('Host: ' + dbHost);
console.log('env host' + process.env.MONGODB_SERVICE_HOST);
console.log('Port: ' + dbPort);
console.log('Username: ' + dbUsername);
console.log('Database: ' + dbName);
mongoose.connect(connectionString);

module.exports = app