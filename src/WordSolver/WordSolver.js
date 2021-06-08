import react from 'react';

const file = "file:///C:/GamesHub/GamesHub/src/WordSolver/Words.txt";

function readTextFile(file) {

    var text;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);

    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4){

            if(rawFile.status === 200 || rawFile.status == 0){

                text = rawFile.responseText;
            }
        }
    }

    return text;
}