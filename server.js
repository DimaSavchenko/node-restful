// BASE SETUP

// dependencies
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// log requests to the console
app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = Number(process.env.PORT || 8080);

var mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://dima:123@ds039135.mongolab.com:39135/Bear');

var Bear = require('./app/models/bear');

// ROUTES
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

router.route('/bears')

	.post(function(req, res) {

		var bear = new Bear();
		bear.name = req.body.name;
		console.log(req.body.name + "  body");
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});


	})

	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) {

				res.send(err);
				console.log(bears);
			}
			console.log(bears);
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')

	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER ROUTES
app.use('/', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
