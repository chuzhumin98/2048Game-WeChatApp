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
}


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

console.log('https server is running');