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

// remote MongoDB
// mongoose.connect('mongodb://username:pwd@ds247141.mlab.com:47141/database-name')

// remote local mongoDB (mongodb-runner)
mongoose.connect('mongodb://localhost:27017/test')

module.exports = app