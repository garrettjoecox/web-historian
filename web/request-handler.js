var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
var qs = require('querystring')

var handler = {
  GET: function(req, res){
    if(req.url === '/'){
      httpHelper.serveAssets(res, archive.paths.siteAssets + '/index.html', 200);
    } else {
      fs.exists(archive.paths.archivedSites + '/' + req.url, function(exists){
        if(exists){
          httpHelper.serveAssets(res, archive.paths.archivedSites + '/' + req.url, 200);
        } else {
          httpHelper.serveAssets(res, archive.paths.siteAssets + '/index.html', 404);
        }
      })
    }
  },

  POST: function(req, res){
    var body = '';
    req.on('data', function(data){
      body += data;
    });
    req.on('end', function(){
      var url = qs.parse(body).url
      fs.exists(archive.paths.archivedSites + '/' + url, function(exists){
        if(exists){
          httpHelper.serveAssets(res, archive.paths.archivedSites + '/' + url, 302);
        } else {
          httpHelper.serveAssets(res, archive.paths.siteAssets + '/loading.html', 302);
          archive.addUrlToList(url);
        }
      })
    })

  }

};

exports.handleRequest = function (req, res) {
  handler[req.method](req, res);
};
