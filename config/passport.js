require('dotenv').config();
// A passport strategy for authenticating with a JSON Web Token
// This allows to authenticate endpoints using a token
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// JWT_SECRET is inside of our environment. 
options.secretOrKey = process.env.JWT_SECRET;



module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // Have a user that we're going to find by the id in the payload
        // When we get a user back, we will check to see if user is in database.
    }))
}