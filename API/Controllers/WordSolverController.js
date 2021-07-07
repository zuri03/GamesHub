var WordSolver = require('../Models/WordSolverModel');

var game = null;

// Display detail page for a specific Genre.
exports.startGame = function(req, res) {

    try{

        game = new WordSolver();

        let letters = game.getLetters();
        res.json(letters);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
};

exports.submitWord = function(req, res) {

    try{
        
        let response = game.checkWord(req.body["submittedWord"]);
        console.log(`returning ${response}`)
        res.json(response);

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}

exports.endGame = function(req, res) {

    try{

        game = null;
        res.send("TRUE");

    } catch(error) {

        console.log(error);
        res.send(error);
    }
}
