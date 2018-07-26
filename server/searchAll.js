const sqlite3 = require('sqlite3');

let database = new sqlite3.Database("game.db", function(e){
 if (e) throw e;
});

let query_command = 'SELECT ID, BESTSCORE FROM PLAYER;' ;
database.all(query_command, (err, results) => {
	console.log(results);
});