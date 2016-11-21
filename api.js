var http = require("http");
var mongo = require("mongodb").MongoClient;
var url = 'mongodb://localhost:27017/image_search'

function get_json(url, callback) {
    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);

            callback(response);
        });
    });
}

// insert url in db
function insertSearch(title) {
	var date  = new Date();
	
    mongo.connect(url, function(error, db) {
        if (error) throw error;
        var collection = db.collection('recents');
        var search = {
            'term': title,
            'date': date.toUTCString()
        };
        collection.insert(search, function(error, data) {
            if (error) throw error;
            console.log(data);
            db.close();
        });
    });
}

// return latest records from db
function getRecents(response) {
	mongo.connect(url, function(error, db) {
		if (error) throw error;
		var collection = db.collection('recents');
		collection.find({}, {
			_id: 0
		}).sort({
			date: -1
		}).limit(5).toArray(function(error, docs) {
			if (error) throw error;
			response.send(docs);
		});
		db.close();
	});
}

module.exports.get_json = get_json;
module.exports.insertSearch = insertSearch;
module.exports.getRecents = getRecents;