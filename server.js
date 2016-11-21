var express = require("express");
var app = express();
var api = require("./api.js");

// using https://pixabay.com/api/docs/ API
var API_KEY = '3812493-dc2f55e6076c7e0db310a0247';
var result = [];
var previous;

app.get('/:url', function(request, response) {
    
    // get url string and create url for api call
    var title = request.params.url;
    
    // the api doesn't allow identical requests, work around it
    if (title === previous) {
        console.log('identical request!');
        response.send(result);
    } else {
        //clear result array
        result = [];
        var URL = "http://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(title);
        api.get_json(URL, function(data) {
            console.log(data.hits);
            for (var i = 0; i < data.hits.length; i++) {
                var obj = {
                    'pageURL': data.hits[i].pageURL,
                    'URL': data.hits[i].webformatURL,
                    'alt': data.hits[i].tags
                };
                result.push(obj);
            }
        previous = title;
        response.send(result);
        });
    }
    
});

app.listen('8080', function() {
    console.log('Listening on port 8080');
});