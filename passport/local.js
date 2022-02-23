const passport = require('passport');
const LocalStrategy =require('passport-local').Strategy;
const { User2 } = require("../models");

module.exports = () =>{
    passport.use('local', new LocalStrategy({
      usernameField: 'name',
      passwordField: 'password',
    }, async (name, password, done) => {
      try {
        const user = await User2.findOne({ where: { name } });
        if (!user) {
          return done(null, false, { message: '존재하지 않는 사용자입니다!' });
        }
          return done(null, user);
        
     
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }))
  };