const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/:stratumaddress/:port')
.add('invoice', '/invoice/id/:bidid')
.add('orderdetails', '/orderdetails/:bidid')
.add('search', '/search')
.add('help', '/help')