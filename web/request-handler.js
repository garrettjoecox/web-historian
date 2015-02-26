var path = require('path');
var bodyParser = require('body-parser');
var httpreq = require('http-request');
var qs = require('querystring');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var cors = require('./http-helpers');
// require more modules/folders here!

var handler = {
  GET: function(req, res){

    if(req.url === '/'){
      console.log("Received get home");
      res.writeHead(200, cors.headers);
      res.end(fs.readFileSync(archive.paths.siteAssets + "/index.html", 'utf8'))
    }else if(fs.existsSync(archive.paths.archivedSites + "/" + req.url)){
      console.log("Recieved Get specified site");
      res.writeHead(200, cors.headers);
      res.end(fs.readFileSync(archive.paths.archivedSites + "/" + req.url, 'utf8'))
    }else{
      console.log("Recieved Get unknown site");
      res.writeHead(404, cors.headers);
      res.end();
    }

  },
  POST: function(req, res){
    res.writeHead(302, cors.headers);
    var body = ""
    req.on('data', function(data){
      body+= data;
      console.log(qs.parse(body).url);
      if(fs.existsSync(archive.paths.archivedSites + "/" + qs.parse(body).url)){
        console.log("Received Post, Existed and returned");
        res.end(fs.readFileSync(archive.paths.archivedSites + "/" + req.url, 'utf8'))
      } else {
        console.log("Received Post, Didn't exist");
        if(!archive.isUrlInList(qs.parse(body).url)){
          console.log("Added to queue");
          archive.addUrlToList(qs.parse(body).url);
        }
        res.end(fs.readFileSync(archive.paths.siteAssets + "/loading.html", 'utf8'))
      }
    });
  }

};

exports.handleRequest = function (req, res) {
  handler[req.method](req, res);
};

