var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var formidable = require('express-formidable');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var app = express();
var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

var mongoURL = 'mongodb://qgreen:password@ds159767.mlab.com:59767/cs290final';
var mongoDB;

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

app.use(['/upload'], formidable());

//app.post('/upload', (req, res) => {
//    console.log(req.fields);
//    console.log(req.files);
//});

// Render the index page for the root URL path ('/').
app.get('/', function (req, res) {
    var collection = mongoDB.collection('models');
    collection.find({}).toArray(function(err, items) {
        if (err) {
            console.log("== Database Fetch Error:", err);
            res.status(500).send("Error fetching people from database: " + err);
        } else {
            res.render('index', {
                items: items
            });
        }
    });
});

app.get('/models/:modelID', function(req, res, next) {
    try { // If the url is a valid id, make it into a mongo id
        var modelID = new ObjectID(req.params.modelID);
    } catch (err) { // Otherwise got to 404
        next();
    }
    mongoDB.collection('models').findOne({_id: modelID}, function(err, doc) {
        // if the ID isn't found or the document isn't retrieved without error, go to 404
        // Otherwise render the page
        if (err || !doc) {
            console.log("Error/NoDoc");
            next();
        } else {
            res.render('model-view', doc);
        }
    });
});

// Catch everything else and serve 404
app.get('*', function(req, res) {
    console.log('404');
    res.status(404).render('404-page');
});

MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log("== Unable to make connection to MongoDB Database.")
    throw err;
  }
  mongoDB = db;
  app.listen(port, function () {
    console.log("== Listening on port", port);
  });
});

