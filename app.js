var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	pg = require('pg'),
	app = express()

// DB connect string with client
var connect = "postgres://sadbuns:sadsad@localhost/purr-rentals-db"

var pool = new pg.Pool({
	connectionString: connect
})

// Assign dust engine to .dust files
app.engine('dust', cons.dust)

// Set defualt ext .dust
app.set('view engine', 'dust')
app.set('views', __dirname + '/views')

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
	// async/await - check out a client
	(async () => {
	  const client = await pool.connect()
	  try {
	    const result = await client.query('SELECT * FROM animal')
	    res.render('index', {animal: result.rows})
	  } finally {
	    client.release()
	  }
	})().catch(e => console.log(e.stack))	
})

app.post('/animals', function (req, res, next) {
  // async/await - check out a client
	(async () => {
	  const client = await pool.connect()
	  try {
  	let animid = Math.floor(Math.random() * 100),
  	 clinid, bizid, packid = Math.floor(Math.random() * 100)
	    const result = await client.query('insert into animal values ($1, $2, $3, $4, $5, $6)', [animid, req.body.name, req.body.diet, clinid, bizid, packid])
	  } finally {
	  	console.log(req.body)
	  	res.redirect('/')
	    client.release()
	  }
	})().catch(e => console.log(e.stack))	
});


// app.post('/add', function(req, res) {
// 	console.log('asdfasdfkjlk')
// 	// pool.connect()
//  //  .then(client => {
//  //  	let animid = Math.floor(Math.random() * 100),
//  //  	 clinid, bizid, packid = Math.floor(Math.random() * 100)
//  //  	let body = req.body
//  //  	console.log(req.body.name)
//   	res.redirect('/')
//     // return client.query('insert into animal values ($1, $2, $3, $4, $5, $6)', [animid, body.name, body.diet, clinid, bizid, packid])
//     //   .then(result => {
//     //     // client.release()
//     //     res.redirect('/')
//     //   })
//     //   .catch(e => {
//     //     // client.release()
//     //     console.log(e.stack)
//     //   })
//   // })
// })

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
// app.use(function(req, res, next) {
// 	next(createError(404))
// })

// app.use(function(err, req, res, next) {
// 	// set locals, only providing error in dev
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') == 'development' ? err : null

// 	// render error page
// 	res.status(err.status || 500)
// 	res.render('error')
// })

module.exports = app

