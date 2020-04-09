const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/:stratumconfig?/:algorithm?')
.add('invoice', '/invoice/id/:bidid')
.add('orderdetails', '/orderdetails/id/:bidid')
.add('profile', '/profile')