// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const dns = require('dns');
const urls = require('./.data/urls.js');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(bodyParser.urlencoded({extended: false}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.route('/api/shorturl/new')
  .post((req, res) => {
    const url = req.body.url;
  
    if (!(url.match(/^https?:\/\/\w+/))) {
      return res.json({error: 'invalid URL'});
    }
    
    dns.lookup(url.replace(/https?:\/\//i, ''), (err, data) => {
      if (err) {
        res.json({error: 'invalid Hostname'});
      } else {
         urls.push({
          original_url: url,
          short_url: urls.length
        });
        res.json(urls.find(d => d.original_url == url));
      }
    });
  });

app.route('/api/shorturl/:short_url')
  .get((req, res) => {
    const shortUrl = req.params.short_url;
    const urlPair = urls.find(url => url.short_url == shortUrl);
    if (urlPair) {
       res.redirect(urlPair.original_url);
    } else {
      res.json({error: 'original url not found'});
    }
  });

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
