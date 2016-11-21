var express = require("express");
var app = express();
var api = require("./api.js");

// using https://pixabay.com/api/docs/ API
var API_KEY = '3812493-dc2f55e6076c7e0db310a0247';
var result = [];
var previousTitle;
var previousOffset;

app.get('/api/:url', function(request, response) {
    
    // get url search term and offset value
    var title = request.params.url;
    var offset = request.query.offset;
    
    // the api doesn't allow identical requests, work around it
    if (title === previousTitle && offset === previousOffset) {
        // if the request is identical to the previous, resend the previous
        // content without calling the API to prevent the server from crashing
        response.send(result);
    } else {
        // empty the array to remove previous results
        result = [];
        
        var URL = "http://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(title)+"&per_page="+offset;
        api.get_json(URL, function(data) {
            //console.log(data.hits);
            for (var i = 0; i < data.hits.length; i++) {
                var obj = {
                    'pageURL': data.hits[i].pageURL,
                    'URL': data.hits[i].webformatURL,
                    'alt': data.hits[i].tags
                };
                result.push(obj);
            }
            
            // store search in db
            api.insertSearch(title);
            
            // update previous vars
            previousTitle = title;
            previousOffset = offset;
        
            // send results
            response.send(result);
        });
    }
    
});

app.get('/latest/', function(request, response) {
   api.getRecents(response);
});

app.listen('8080', function() {
    console.log('Listening on port 8080');
});