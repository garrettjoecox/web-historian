var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
var qs = require('querystring');

var handler = {
  GET: function(req, res){
    var url = httpHelper.urlparse(req.url);
    if(url === '/' || url === ""){
      httpHelper.serveAssets(res, archive.paths.index, 200);
    } else {
      archive.isURLArchived(url, function(exists){
        if(exists){
          httpHelper.serveAssets(res, archive.paths.archivedSites + url, 200);
        } else {
          httpHelper.serveAssets(res, archive.paths.index, 404);
        }
      });
    }
  },

  POST: function(req, res){
    var body = '';
    req.on('data', function(data){
      body += data;
    });
    req.on('end', function(){
      var url = httpHelper.urlparse(qs.parse(body).url);
      archive.isURLArchived(url, function(exists){
        if(exists){
          httpHelper.serveAssets(res, archive.paths.archivedSites + url, 302);
        } else {
          httpHelper.serveAssets(res, archive.paths.loading, 302);
          archive.addUrlToList(url);
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  handler[req.method](req, res);
};
