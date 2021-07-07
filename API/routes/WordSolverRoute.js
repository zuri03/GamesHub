var WordSolver_controller = require('../Controllers/WordSolverController');
var express = require('express');

var router = express.Router();

router.get('/', );

router.get('/startGame', WordSolver_controller.startGame);

router.post('/submitWord', WordSolver_controller.submitWord);

router.post('/endGame', WordSolver_controller.endGame);

module.exports = router;