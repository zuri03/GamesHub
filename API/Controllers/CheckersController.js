var Checkers = require('./CheckersModel');

// Display detail page for a specific Genre.
exports.startCheckers = function(req, res) {

    console.log("START WAS CALLED");

    try{

        Checkers.startGame();
        let board = Checkers.getBoard();
        res.json(board);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
};

exports.getCheckers = function(req, res) {

    console.log("GET CHECKERS WAS CALLED");
    try{

        let board = Checkers.getBoard().toString();
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
        let response = Checkers.handleClick(req.body["id"]);
        res.send(response);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.handleDoubleClick = function(req, res) {

    let response = Checkers.resetSelected();
    res.send(response);
}

exports.switchTurn = function(req, res) {

    Checkers.switchTurn();
    res.send("True");
}