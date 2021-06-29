var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(home);
});

router.get('/Checkers', function(req, res, next){
    res.redirect("http://localhost:3000/Checkers");
});

router.get('/WordSolver', function(req, res, next){
    res.redirect("http://localhost:3000/WordSolver");
});


module.exports = router;
