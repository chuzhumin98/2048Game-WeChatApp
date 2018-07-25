const koa = require('koa');
const route = require('koa-route');
const http = require('http');
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');

const app = new koa();

//Force HTTPS on all page
app.use(enforceHttps());

const query = (ctx, next) => {
	ctx.response.body = "Welcome to query";
	ctx.response.type = "text/plain";
	console.log("visit for query");
};

const record = (ctx, next) => {
	ctx.response.body = "Welcome to record";
	ctx.response.type = "text/plain";
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
app.use(route.get('/record', record));
app.use(route.get('/code', code));

console.log('https server is running');