// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
const helmet = require('helmet')
// With express
const express = require('express')

express().use(helmet({
  frameguard: false
}));

app.prepare().then(() => {
  express().use(handler).listen(3000)
})