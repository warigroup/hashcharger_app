// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
// With express
const express = require('express')
const helmet = require('helmet')

const expressApp = express();
expressApp.use(helmet())

app.prepare().then(() => {
  express().use(handler, helmet.frameguard()).listen(3000)
})