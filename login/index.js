const express = require("express");
var path = require('path');
const { User2 } = require("../models");
const router = express.Router();
const passport = require("passport");
const models = require("../models");

router.get('/',(req,res)=>{

    console.log("dd",req.cookies);
    console.log("값좀볼까?",req.session);
    res.sendFile(path.join(__dirname,'../login.html'));
})
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));



router.get('/signup',(req,res)=>{
    
    res.sendFile(path.join(__dirname,'../signup.html'));
})

router.post('/signup',async (req,res)=>{
    
    let isExist =await User2.findOne({
        where:{ name : req.body.name}
    })

    if(!isExist){
        User2.create({
        name: req.body.name,
        password : req.body.password
    });
}
res.sendFile(path.join(__dirname,'../login.html'));
})


module.exports = router;