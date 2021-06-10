
var fs = require('fs');

var read = function(){

    var fileContents;

    fs.readFile('C:/GamesHub/GamesHub/src/WordSolver/WordsLite.txt', function (err, data) {

        if (err) throw err;

        fileContents = data;
        return fileContents.toString();
    });
}

var text = read();

export default text;