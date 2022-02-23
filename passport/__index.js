
 const passport = require('passport');
 const { User2 } = require("../models");
 const local = require("./local");
 const LocalStrategy =require('passport-local').Strategy;

 module.exports = ()=>{
    passport.serializeUser((user,done)=>{
        console.log("???????????????????????????")
        done(null,user.name);
    });
    passport.deserializeUser((name,done)=>{
        console.log("???????????????????????????")
        done(null,name);
    });
    
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
 }
