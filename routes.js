const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/(|marketplace?)/:algorithm?')
.add('addminers', '/addminers')
.add('invoice', '/invoice/id/:bidid')
.add('profile', '/profile/:sellorders?')