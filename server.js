// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
// With express
const express = require('express')
var xFrameOptions = require('x-frame-options')
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
}  
express().use(xFrameOptions());

app.prepare().then(() => {
  express().use(handler).listen(3000)
})