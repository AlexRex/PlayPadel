//PostgreSQL - Create Database Script

var pg = require('pg');

//Credenciales
var dbName = 'playpadel';
var connectionStringPri = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/postgres';
var connectionStringPost = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/'+dbName;

//Connect to postgres default DB
pg.connect(connectionStringPri, function(err, client, done){
	
	if(err)
		console.log('Error while connecting to postgres default db: '+err);

	//Create PlayPadel's DB
	client.query('CREATE DATABASE '+dbName, function(err){
		if(err)
			console.log('PlayPadel DB already exists'); 
		else
			console.log('PlayPadel DB created');
		client.end(); //Close connection

		//Raw Queries. Updated: Now sequelizes does the work
		/*else{
			//Create a new connection to the new db
			pg.connect(connectionStringPost, function(err, clientOrg, done){
				//Create PlayPadel DB Structure 
				//Users
				console.log('PlayPadel DB does not exit yet');
				console.log('Creating database . . .');
				var query = clientOrg.query('CREATE TABLE users'+
											'('+
												'email VARCHAR(20) PRIMARY KEY,'+
												'name VARCHAR(20) not null,'+
												'lastname VARCHAR(20) not null,'+
												'password VARCHAR(15) not null'+
											')');
				console.log('created Users Table');
				//Matchs
				var query = clientOrg.query('CREATE TABLE matchs'+
											'('+
												'id SERIAL PRIMARY KEY,'+
												'city VARCHAR(20) not null,'+
												'club VARCHAR(20) not null,'+
												'price FLOAT not null,'+
												'category VARCHAR(20) not null'+
											')');
				console.log('created Matchs Table');
				//Comments
				var query = clientOrg.query('CREATE TABLE comments'+
											'('+
												'thread VARCHAR(20),'+
												'author_email VARCHAR(20) not null,'+
												'match INTEGER not null,'+
												'content VARCHAR(255) not null,'+
												'created DATE not null,'+
												'PRIMARY KEY(author_email, match),'+
												'FOREIGN KEY(author_email) REFERENCES users(email),'+
												'FOREIGN KEY(match) REFERENCES matchs(id)'+
											')');
				console.log('created Comments Table');
				//Users - Matchs --> Relation N:N
				var query = clientOrg.query('CREATE TABLE play'+
											'('+
												'match_id INTEGER,'+
												'player VARCHAR(20),'+
												'PRIMARY KEY (match_id, player),'+
												'FOREIGN KEY (player) REFERENCES users(email),'+
												'FOREIGN KEY (match_id) REFERENCES matchs(id)'+
											')');
				console.log('created Play (Users - Matchs) Table');
				//Close client connection
				query.on('end', function(){ 
					clientOrg.end();
					client.end(); //Close both connections
				});
			});
		}*/
	});
});
