var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express();

// DB connect string with client
var connect = "postgres://sadbuns:sadsad@localhost/purr-rentals-db"
var client = new pg.Client(connect, function(err, client, done) {
	if (err) {
		console.log(err)
	}
})

// Assign dust engine to .dust files
app.engine('dust', cons.dust)

// Set defualt ext .dust
app.set('view engine', 'dust')
app.set('views', __dirname + '/views')

// Set public folder
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
	res.render('index')
})

// Server
app.listen(3000, function(){
	console.log('server started on 3000')
})

// caching off, should be for sensitive info
// function requestHandler(req, res) {
//     res.setHeader('Cache-Control','no-cache,no-store,max-age=0,must-revalidate');
//     res.setHeader('Pragma','no-cache');
//     res.setHeader('Expires','-1');
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

app.use(function(err, req, res, next) {
	// set locals, only providing error in dev
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') == 'development' ? err : null

	// render error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app