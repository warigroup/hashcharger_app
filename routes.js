const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/market/:stratumaddress?/:stratumport?/:username?/:password?/:navcolor?/:navtexts?/:btncolor?/:btntexts?/:nightmode?')
.add('invoice', '/invoice/id/:bidid')
.add('orderdetails', '/orderdetails/id/:bidid')
.add('orderhistory', '/orderhistory')
.add('help', '/help')