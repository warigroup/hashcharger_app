const routes = require('next-routes')

module.exports = routes()
.add('marketplace', '/market/:stratumaddress?/:stratumport?/:username?/:password?/:algorithm?/:navbg?/:navtexts?/:primary?/:secondary?/:buttontexts?/:tabletexts?/:mytoken?/:mysubuser?')
.add('invoice', '/invoice/id/:bidid')
.add('orderhistory', '/orderhistory')