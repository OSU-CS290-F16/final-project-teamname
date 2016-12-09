var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var multer = require('multer');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; // Need this to allow searching database by _id

var app = express();
var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

// Hard Coded url isn't ideal, but it is simple.
var mongoURL = 'mongodb://qgreen:password@ds159767.mlab.com:59767/cs290final';
var mongoDB;

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));


var upload = multer({dest: 'public/'});
app.post('/upload', upload.fields([
            {name: 'model', maxCount: 1},
            {name: 'image', maxCount: 6},
]), function(req, res) {
    var newModel = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        model: req.files.model[0].path,
        photos: req.files.image.map(function(x) {return '/' + x.filename}), // Get the path from each image
    }
    mongoDB.collection('models').insert(newModel);
    console.log(req.body);
    console.log(req.files);
    res.redirect('/');

});

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
            next();
        } else {
            res.render('model-view', doc);
        }
    });
});

// Catch everything else and serve 404
app.get('*', function(req, res) {
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

