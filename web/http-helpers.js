var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, statusCode) {
  console.log('Serving: ', asset, statusCode);
  res.writeHead(statusCode, exports.headers);
  fs.readFile(asset, function(err, data){
    res.end(data);
  });
};

exports.urlparse = function(url){
  if (!url) return;
  newUrl = url;
  if(newUrl.substring(0,8) === 'https://') newUrl = newUrl.substring(8);
  if(newUrl.substring(0,7) === 'http://') newUrl = newUrl.substring(7);
  if(newUrl.substring(0,4) === 'www.') newUrl = newUrl.substring(4);
  if(newUrl.substring(newUrl.length-4).indexOf('.') === -1) newUrl = newUrl + ".com";
  return newUrl;
};