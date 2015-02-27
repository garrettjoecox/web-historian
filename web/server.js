var helpers = require('../web/helpers');
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs-utils');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/', function(req, res){
  res.sendFile(helpers.paths.index);
  console.log("GET: ", helpers.paths.index);
});

app.post('/', function(req, res){
  var site = helpers.urlize(req.body.url);
  console.log("POST: ", site);
  helpers.isURLArchived(site, function(exists){
    if (exists){
      fs.readFile(helpers.paths.archivedSites + site, function(err, data){
        res.send(data);
      });
    } else {
      res.sendFile(helpers.paths.loading);
      helpers.addUrlToList(site);
    }
  });
});

app.listen(9000, function(){
  console.log('Listening on 9000');
});