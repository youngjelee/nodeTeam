var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.send('done');
  });

  router.get('/shout', function(req, res) {
    res.send('shout');
  });
  router.get('/game', function(req, res) {
    res.send('game');
  });
  router.get('/game/:id', function(req, res,next) {
      console.log(req.method);
      console.log(req.originalUrl);
      console.log(req.params.id);
      if(req.params.id=== 0) next('route')
        else next();      
  });
 
  

  module.exports = router;