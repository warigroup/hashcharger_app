const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/:stratumconfig?/:port?/:algorithm?')
.add('invoice', '/invoice/id/:bidid')
.add('orderdetails', '/orderdetails/:bidid')
.add('search', '/search')
.add('help', '/help')