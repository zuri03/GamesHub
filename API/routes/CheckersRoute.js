var checkers_controller = require('../Controllers/CheckersController');
var express = require('express');

var router = express.Router();

router.get('/', checkers_controller.startCheckers);

router.get('/getCheckers', checkers_controller.getCheckers);

router.post('/handleClick', checkers_controller.handleClick);

router.post('/handleDoubleClick', checkers_controller.handleDoubleClick);

router.post('/switchTurn', checkers_controller.switchTurn);

module.exports = router;
