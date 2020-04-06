// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
// With express
const express = require('express')
const frameguard = require('frameguard')

// var enableCORS = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
//   if ('OPTIONS' === req.method) {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// };

express().use(frameguard({ action: 'deny' }))

app.prepare().then(() => {
  express().use(handler).listen(3000)
})