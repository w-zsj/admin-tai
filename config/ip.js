let proxyTable = false, target = "'http://testapi.taihail.com/admin'"

//获取本地ip
function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
module.exports = {
  target, proxyTable,
  host: getIPAdress()
}