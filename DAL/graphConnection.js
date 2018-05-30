var neo4j = require('neo4j');
console.log("Connecting to GraphDB...");

// Go Daddy Server
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@208.109.52.74:7474');

// Local Host
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@localhost:7474');
// // Hamza Server
// var test = 'http://neo4j:object00@172.19.45.42:7474';
// var db = new neo4j.GraphDatabase(test);
// console.log(test);

//office server

var test = 'http://neo4j:object00@172.19.0.89:7474';
//var test = 'http://neo4j:object00@172.19.44.41:7474';

var db = new neo4j.GraphDatabase(test);
// console.log(test);

// Alvi Server
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@172.19.44.41:7474');
 // var db = new neo4j.GraphDatabase('http://neo4j:object00@172.19.44.41:7474');
 

db.cypher({
        query: "MATCH (n:testNode) return n"
    }, function(err, results) {
    	if(err){
			console.log("Error in GraphDB connection.");
			console.log(err);
    	} else {
			console.log("Successful GraphDB connection.");

    	}
    });

module.exports = db;