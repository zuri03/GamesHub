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

        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));

        for(let i = 1; i <= 6; i++){
            
            this.state.letters.push(chars.charAt(Math.floor(Math.random() * chars.length)))
        }

        this.cancelTime = 0;
        this.pointsBoost = 1;
        this.submittedWords = [];

        this.handleChange = this.handleChange.bind(this);
        this.setResults = this.setResults.bind(this);
        this.incrementPoints = this.incrementPoints.bind(this);
        this.startGame = this.startGame.bind(this);
        this.secondsToTime = this.secondsToTime.bind(this);
        this.countDown = this.countDown.bind(this);

        this.state.time = this.secondsToTime(this.state.seconds);
    }

    async checkWord(event){

        event.preventDefault();

        if(this.state.hasStarted){

            let isCorrect = true;

            for(let i = 0; i < this.state.checkedWord.length; i++){

                if(!this.state.letters.includes(this.state.checkedWord[i])){

                    this.setResults("ONE OR MORE LETTERS ARE NOT CURRENTLY ALLOWED");
                    isCorrect = false;
                }

                if(!isNaN(this.state.checkedWord[i])){

                    this.setResults("ONLY LETTERS ALLOWED");
                    isCorrect = false;
                }

                if(!(/[a-z]/).test(this.state.checkedWord[i])){

                    this.setResults("NO PUNCUATION ALLOWED");
                    isCorrect = false;
                }
            }

            if(this.submittedWords.find(element => element === this.state.checkedWord) !== undefined){

                isCorrect = false;
                this.setResults("YOU HAVE ALREADY SUBMITTED THIS WORD");
            }
            
            if(isCorrect){

                try{

                    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${this.state.checkedWord}?key=3d9a89de-d4ee-44bc-b1ad-cd8b9f10e0c8`);
                    
                    let json = response.json();
                    
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

            let add = this.state.points + (100 * this.pointsBoost);
            this.setPoints(add); 
            
            let newBoost = this.pointsBoost + 0.5;
            this.pointsBoost = newBoost;
            
        } else {
            
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

        let obj = this.secondsToTime(this.state.seconds);
        this.setState({time : obj});
        this.cancelTime = setInterval(this.countDown, 1000);
    }

    countDown() {
        
        let seconds = this.state.seconds - 1;
        let newTime = this.secondsToTime(seconds);

        this.setState({
          time: newTime,
          seconds: seconds,
        });

        if (seconds === 0) {

            clearInterval(this.cancelTime);

            this.pointsBoost = 1;
            
            this.setResults(`GAME OVER \n You got ${this.state.points} points! \n Press start to restart the game!`)
            this.setState({
                points : 0,
                hasStarted : false,
                seconds : 180
            });
        }
    }

    secondsToTime(secs){

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
        
        if(!this.state.hasStarted){
            
            timer = <button className="Start" onClick={this.startGame}>START!</button>   
        } else {
            
            timer = <div className="Start">{this.state.time.m} : {this.state.time.s}</div>   
        } 

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
                            <input type="text" value={this.state.checkedWord} onChange={this.handleChange} name="name" />
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
                <div className="Description">
                    <p>Press start the begin the game</p>
                    <p>Every correct word will add 100 points to your score</p>
                    <p>Submitting multiple correct words in a row will increase the points booster!</p>
                    <p>Submitting an incorrect word will reset the booster and subtract 100 points</p>
                    <p>You have 3 minutes to guess as many words as possible, Good Luck!</p>
                </div>
            </div>
        )
    }
}

export default WordSolver;