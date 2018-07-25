const sqlite3 = require('sqlite3');

let database = new sqlite3.Database("game.db", function(e){
 if (e) throw e;
});

let create_player = "CREATE TABLE PLAYER("
	   +"ID CHAR(60) PRIMARY KEY     NOT NULL,"
	   +"BESTSCORE           INT    NOT NULL"
	   +");" //the command to create player table

database.run(create_player, function(e) {
	console.log(e);
});

let create_state = "CREATE TABLE STATE("
	   +"ID CHAR(60) PRIMARY KEY     NOT NULL,"
	   +"CURRENTSCORE           INT    NOT NULL,"
	   +"GRID00 INT  NOT NULL,"
	   +"GRID01 INT  NOT NULL,"
	   +"GRID02 INT  NOT NULL,"
	   +"GRID03 INT  NOT NULL,"
	   +"GRID10 INT  NOT NULL,"
	   +"GRID11 INT  NOT NULL,"
	   +"GRID12 INT  NOT NULL,"
	   +"GRID13 INT  NOT NULL,"
	   +"GRID20 INT  NOT NULL,"
	   +"GRID21 INT  NOT NULL,"
	   +"GRID22 INT  NOT NULL,"
	   +"GRID23 INT  NOT NULL,"
	   +"GRID30 INT  NOT NULL,"
	   +"GRID31 INT  NOT NULL,"
	   +"GRID32 INT  NOT NULL,"
	   +"GRID33 INT  NOT NULL"
	   +");" //the command to create state table to store last state

database.run(create_state, function(e) {
	console.log(e);
});