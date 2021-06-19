import React from 'react';
import './WordSolver.css';

class WordSolver extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            letters: [],
            results: "",
            checkedWord: null,
            points: 0,
            time: null,
            seconds: 180,
            hasStarted: false
        }

        var chars = "abcdefghijklmnopqrstuvwxyz";
        var vowels = "aeiou";

        //Generate the random letters by starting with two vowels to ensure player does not end up with only consonants
        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));

        //Generate six more random letters for a total of eight 
        for(let i = 1; i <= 6; i++){
            
            this.state.letters.push(chars.charAt(Math.floor(Math.random() * chars.length)))
        }

        //Cancel time is a variable returned by set interval that allows use to end the set interval method
        this.cancelTime = 0;

        //Points boost increases the amount of points for every correct word 
        this.pointsBoost = 1;

        //An array of words the player has already used
        this.submittedWords = [];

        this.handleChange = this.handleChange.bind(this);
        this.setResults = this.setResults.bind(this);
        this.incrementPoints = this.incrementPoints.bind(this);
        this.startGame = this.startGame.bind(this);
        this.secondsToTime = this.secondsToTime.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    async checkWord(event){

        //Since the event comes from a form prevent default so we do not reload the page
        event.preventDefault();

        //First check if the game has started
        if(this.state.hasStarted){

            //For now we assume the word is correct and run a series of checks to see if it is incorrect in any way
            let isCorrect = true;

            //For every character in the word the player has submitted
            for(let i = 0; i < this.state.checkedWord.length; i++){

                //If the player has submitted a character that was not randomly generated 
                if(!this.state.letters.includes(this.state.checkedWord[i])){

                    this.setResults("ONE OR MORE LETTERS ARE NOT CURRENTLY ALLOWED");
                    isCorrect = false;
                }

                //If the player has submitted a character that is not a letter
                if(!isNaN(this.state.checkedWord[i])){

                    this.setResults("ONLY LETTERS ALLOWED");
                    isCorrect = false;
                }

                //Ensures the player does not submit any puncuation
                if(!(/[a-z]/).test(this.state.checkedWord[i])){

                    this.setResults("NO PUNCUATION ALLOWED");
                    isCorrect = false;
                }
            }

            //Check if the player has submitted a word that has been previously submitted
            if(this.submittedWords.find(element => element === this.state.checkedWord) !== undefined){

                isCorrect = false;
                this.setResults("YOU HAVE ALREADY SUBMITTED THIS WORD");
            }
            
            //If the word passes all of the checks it moves on to the final check
            if(isCorrect){

                try{

                    //Send a call to meriam API
                    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${this.state.checkedWord}?key=3d9a89de-d4ee-44bc-b1ad-cd8b9f10e0c8`);
                    
                    let json = response.json();
                    
                    //This is a weird way to check if it is a correct word
                    //However if the json contains a meta section then the word is a correct english word
                    json.then((res) => {
        
                        if(res[0].meta === undefined){
        
                            this.setResults("NOT A WORD");
                            isCorrect = false;
                            this.incrementPoints(isCorrect)
        
                        } else {
        
                            this.setResults("CORRECT!");
                            this.submittedWords.push(this.state.checkedWord);
                            this.incrementPoints(isCorrect);
                        }
                                    
                    }).catch((error) => {
        
                        console.log('res error: ' + error);
                    });
        
                } catch(error) {
        
                    console.log(error);   
                } 
            }
        } else{

            this.setResults("MUST START GAME BEFORE YOU ENTER ANY WORDS");
        }
    }

    incrementPoints(isCorrect){

        if(isCorrect){

            //Every correct word gets 100 times whatever the point boost is at this point
            let add = this.state.points + (100 * this.pointsBoost);
            this.setPoints(add); 
            
            let newBoost = this.pointsBoost + 0.5;
            this.pointsBoost = newBoost;
            
        } else {
            
            //an incorrect word subtracts 100 points and resets the points boost to 1
            let subtract = this.state.points - 100;
            this.setPoints(subtract);

            this.pointsBoost = 1;
        }
    }

    setPoints(points){

        this.setState({points: points});
    }

    setResults(message){

        this.setState({results: message});
    }

    handleChange(event) {
    
        this.setState({checkedWord: event.target.value.toLowerCase()});
    }

    timeDisplay(){

        if(!this.state.hasStarted){

            return(
                <button className="Start" onClick={this.startGame}>
                        START!
                </button>
            )
        } else {

            this.startTimer();

            return(
                <div className="Start">
                    {this.state.time.m} : {this.state.time.s}
                </div>
            )
        }  
    }

    startGame(){

        this.setState({hasStarted : true});
        this.startTimer();
    }

    startTimer(){

        //Create a time object, set it to the time property of state and start the timer with the set interval and countdown method
        //The method will be executed every second
        let obj = this.secondsToTime(this.state.seconds);
        this.setState({time : obj});
        this.cancelTime = setInterval(this.countDown, 1000);
    }

    countDown() {
        
        //decrement seconds by one and create a new time object based on the new amount of seconds
        let seconds = this.state.seconds - 1;
        let newTime = this.secondsToTime(seconds);

        //update time and seconds property
        this.setState({
          time: newTime,
          seconds: seconds,
        });

        //If the countdown is over
        if (seconds === 0) {

            //We use the cancel time number we get from set interval to stop the timer
            clearInterval(this.cancelTime);

            this.pointsBoost = 1;
            
            //display results of game and reset necesary state properties
            this.setResults(`GAME OVER \n You got ${this.state.points} points! \n Press start to restart the game!`)
            this.setState({
                points : 0,
                hasStarted : false,
                seconds : 180
            });
        }
    }

    secondsToTime(secs){

        //From stack overflow:
        //Create a time object by converting the amount of seconds into minutes and seconds
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        
        return obj;
    }

    render(){

        let timer;
        
        !this.state.hasStarted ? 
            timer = <button className="Start" onClick={this.startGame}>START!</button> :
            timer = <div className="Start">{this.state.time.m} : {this.state.time.s}</div>

        return(
            <div className="Word-solver">
                <div className="Letter-display">
                    {this.state.letters.map((letter) => {
                        return <div className="Single-Letter">{letter.toUpperCase()}</div>
                    })}
                </div>
                <div className="Input">
                    <form onSubmit={(e) => this.checkWord(e)}>
                        <label>Word:
                            <input type="text" value={this.state.checkedWord} onChange={this.handleChange} name="name" placeholder="Enter Here" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div className="Game-Info">
                    <div className="Points">
                        {this.state.points}
                    </div>
                    <div className="Results">
                        {this.state.results}
                    </div>
                    <div className="Timer">
                        {timer}
                    </div>
                </div>
            </div>
        )
    }
}

export default WordSolver;