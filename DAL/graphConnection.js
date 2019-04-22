var neo4j = require('neo4j');
//console.log("Connecting to GraphDB...");

// Go Daddy Server
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@208.109.52.74:7474');

// Local Host
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@localhost:7474');
// // Hamza Server
// var test = 'http://neo4j:object00@172.19.45.42:7474';
// var db = new neo4j.GraphDatabase(test);
// //console.log(test);

//office server

// var test = 'http://neo4j:object00@202.69.61.245:7474';
// var test = 'http://neo4j:object00@localhost:7474';

// var test = 'http://neo4j:object00@172.19.0.89:7474';
// var test = 'http://neo4j:object00@115.186.56.78:7474';http://71.114.64.10:
// var test = 'http://neo4j:object00@71.114.64.10:7474';http://169.62.218.108
// var test = 'http://neo4j:object00@169.62.218.108:7474';
//browser/
// var test = 'https://10-0-1-234-36875.neo4jsandbox.com/';
var test = 'http://neo4j:Spring!2019@169.62.218.105:7474';


var db = new neo4j.GraphDatabase(test);
// //console.log(test);

// Alvi Server
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@172.19.44.41:7474');
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@172.19.44.41:7474');
 

db.cypher({
        query: "MATCH (n:testNode) return n"
    }, function(err, results) {
    	if(err){
			//console.log("Error in GraphDB connection.");
			//console.log(err);
    	} else {
			//console.log("Successful GraphDB connection.");

    	}
    });

module.exports = db;