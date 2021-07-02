var Checkers = require('./CheckersModel');

var game = null;

// Display detail page for a specific Genre.
exports.startCheckers = function(req, res) {

    console.log("I HATE THIS");

    try{

        game = new Checkers();
        game.startGame();
        let board = game.getBoard();
        res.json(board);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
};

exports.getCheckers = function(req, res) {

    console.log("GET CHECKERS WAS CALLED");
    try{

        let board = game.getBoard();
        res.json(board);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.handleClick = function(req, res) {

    console.log("Handle Click Called");

    try{

        console.log(req.body["id"]);
        let response = game.handleClick(req.body["id"]);
        console.log(`response ${response.message}`);
        res.json(response);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.handleDoubleClick = function(req, res) {

    let response = game.resetSelected();
    res.send(response);
}

exports.switchTurn = function(req, res) {

    console.log("SWITCH TURN CALLED")

    let response = game.switchTurn();
    console.log(`Turn is now ${response}`);
    res.send(response);
}