var Checkers = require('./CheckersModel');

var game = null;

// Display detail page for a specific Genre.
exports.startCheckers = function(req, res) {

    try{

        if(game === null){
            game = new Checkers();
            game.startGame();
        } 

        let board = game.getBoard();
        res.json(board);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
};

exports.getCheckers = function(req, res) {
    try{

        let board = game.getBoard();
        res.json(board);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.handleClick = function(req, res) {

    try{

        let response = game.handleClick(req.body["id"]);
        res.json(response);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.handleDoubleClick = function(req, res) {

    try{

        game.handleDoubleClick();
        res.send("TRUE");

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.switchTurn = function(req, res) {

    let response = game.switchTurn();
    res.send(response);
}