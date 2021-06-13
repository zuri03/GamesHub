
var fs = require('fs');

var read = function(){

    fs.readFile('C:/GamesHub/GamesHub/src/WordSolver/WordsLite.txt', function (err, data) {

        if (err) throw err;

        let str = data.toString();
        let words = []
        
        let i = 0;

        while(i < str.length){

            let word = []

            while(str[i] !== "," && (/[a-z]/).test(str[i])){
                word.push(str[i]);
                i++;
            }

            let print = "";

            word.forEach(char => {
                print += char.toString();
            });

            words.push(print);
            i++;
        }

        return words;
    });
}

var text = read();

export default text;