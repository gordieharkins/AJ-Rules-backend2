var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var auth = require('./auth');
var path = require('path');
var Response = require(path.resolve(__dirname, './response'));
var db = require(path.resolve(__dirname, '../../DAL/graphConnection'));
var jwt = require('jsonwebtoken');



// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
    var opts = {};
    // console.log("=========================PASSPORT JwtStrategy=============================================");

    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = auth.secret;
    // console.log("opts:",opts);
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        var credentials = jwt_payload;
        var query = `MATCH (user:user)
                    WHERE user.email1= {email} AND id(user) = {userId}
                    OPTIONAL Match(role:UserRole) where role.name = user.role
                    RETURN id(user) AS userId, properties(role) as roles, user.name as userName`;
        db.cypher({
            query: query,
            params:{
                email:jwt_payload.email,
                userId:jwt_payload.userId
            }
        }, function(err, results) {
            if(err){
                done(err,null);
            } else {
                done(err,results);
            }
        });

    }));

    // console.log("=============================================================================================");
};