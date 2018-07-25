const koa = require('koa');
const route = require('koa-route');
const http = require('http');
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');
const sqlite3 = require('sqlite3');

const app = new koa();

let database = new sqlite3.Database("game.db", function(e){
	if (e) throw e;
});

let best_scores = {};

//Force HTTPS on all page
app.use(enforceHttps());

//query for the best score
let query_best = function (openid) {
	let query_command = 'SELECT BESTSCORE '
		+ 'FROM PLAYER ' 
		+ 'WHERE ID = "' + openid + '";';
	database.all(query_command, (err, results) => {
		console.log(results);
		if (results.length === 0) {
			let insert_command = 'INSERT INTO PLAYER (ID, BESTSCORE)'
				+ 'VALUES ("' + openid + '", 0);' //default to set score with 0
			database.run(insert_command, function(e) {
				console.log(e);
			});
			best_scores[openid] = 0;
		} else {
			best_scores[openid] = results[0].BESTSCORE; //set the best score with the record in database
		}
	});
}

const query = (ctx, next) => {
	console.log(best_scores);
	const query = ctx.request.query;
	let best_score = best_scores[query.id];
	if (best_score === undefined) {
		ctx.response.body = {BESTSCORE: 0};
	} else {
		ctx.response.body = {BESTSCORE: best_score};
	}
	ctx.response.type = 'application/json';
	ctx.response.status = 200;
	console.log("best_score: "+best_score);
};


const record = (ctx, next) => {
	const query = ctx.request.query;
	console.log('query:'+query.id+' '+query.best);
	let query_command = 'SELECT BESTSCORE '
		+ 'FROM PLAYER ' 
		+ 'WHERE ID = "' + query.id + '";';
	database.all(query_command, (err, results) => {
		if (results.length === 0) {
			let insert_command = 'INSERT INTO PLAYER (ID, BESTSCORE)'
				+ 'VALUES ("' + query.id + '", ' + query.best + ');' //default to set score with 0
			database.run(insert_command, function(e) {
				console.log(e);
			});
		} else {
			let update_command = 'UPDATE PLAYER SET BESTSCORE = ' 
				+ Math.max(query.best, results[0].BESTSCORE) + ' WHERE ID = "' + query.id + '";'
			database.run(update_command, function(e) {
				console.log(e);
			})
		}
	});
	ctx.response.body = "Load to record";
	ctx.response.type = "text/plain";
	ctx.status = 200;
	console.log("visit for record");
};

const code = (ctx, next) => {	
	const request = require('sync-request');
	let user_openid = null; //save for user's openid
	const query = ctx.request.query;
	let codes = query.code;
	
	const appId = "wx147218704d32ac2b";
	const secret = "fba3ccd510c770441df667a80a915e14";
	console.log('code:'+codes);
	let res = request('GET', 'https://api.weixin.qq.com/sns/jscode2session?appid=' 
			+ appId + '&secret=' + secret + '&js_code=' 
			+ codes + '&grant_type=authorization_code');
	user_openid = JSON.parse(res.getBody().toString()).openid;
	console.log('openid:'+user_openid);
	
	ctx.response.status = 200;
	ctx.response.type = 'application/json';
	ctx.response.body = {openid: user_openid};
	console.log('send for client');
	query_best(user_openid);
}; //get for user's openid


//SSL options
const options = {
    key: fs.readFileSync('./ssl/domain.key'),  //ssl file path
    cert: fs.readFileSync('./ssl/chained.pem')  //ssl file path
};

//start the server
http.createServer(app.callback()).listen(80);
https.createServer(options, app.callback()).listen(443);

app.use(route.get('/query', query));
//app.use(route.get('/query_data', query));
app.use(route.get('/record', record));
app.use(route.get('/code', code));

console.log('https server is running');