// const passport = require('passport'),
    const LocalStrategy =require('passport-local').Strategy;
    const { User2 } = require("../models");

    module.exports =(passport)=> {

        passport.serializeUser((user,done)=>{
            done(null,user.name);
        });
        passport.deserializeUser((name,done)=>{
            done(null,name);
        });

    
    passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password',
    },async function (name, password, cb) {
       
       console.log("???????????????????????????")
 
        let user = await User2.findOne({
            where : {name }
        });
        console.log(user);
        if(!user){return cb(null,false,{message: '떙'})}
        return cb(null,user);

      } ));



}