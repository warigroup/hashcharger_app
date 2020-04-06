// server.js
const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)
const cors = require('cors')

// With express
const express = require('express')
const expressApp = express();
expressApp.use(cors())

app.prepare().then(() => {
  expressApp.use(handler).listen(3000)
})