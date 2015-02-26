var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
var qs = require('querystring');

var handler = {
  GET: function(req, res){
    if(req.url.substring(0,7) === 'http://') req.url = req.url.substring(7);
    if(req.url.substring(0,4) === 'www.') req.url = req.url.substring(4);
    if(req.url === '/' || req.url === ""){
      httpHelper.serveAssets(res, archive.paths.index, 200);
    } else {
      archive.isURLArchived(req.url, function(exists){
        if(exists){
          httpHelper.serveAssets(res, archive.paths.archivedSites + req.url, 200);
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
      var url = qs.parse(body).url;
      // if(url === undefined) return;
      if(url.substring(0,7) === 'http://') url = url.substring(7);
      if(url.substring(0,4) === 'www.') url = url.substring(4);
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
