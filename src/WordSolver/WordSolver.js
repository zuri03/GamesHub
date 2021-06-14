import React from 'react';
import './WordSolver.css';

class WordSolver extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            letters: [],
            results: "PLACEHOLDER",
            checkedWord: null,
            points: 0,
            pointsBoost: 1,
            time: null,
            hasStarted: false
        }

        var chars = "abcdefghijklmnopqrstuvwxyz";
        var vowels = "aeiou";

        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
        this.state.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));

        for(let i = 1; i <= 6; i++){
            this.state.letters.push(chars.charAt(Math.floor(Math.random() * chars.length)))
        }

        this.handleChange = this.handleChange.bind(this);
        this.setResults = this.setResults.bind(this);
    }

    async makeApiCall(){

        try{

            const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${this.state.checkedWord}?key=3d9a89de-d4ee-44bc-b1ad-cd8b9f10e0c8`);
            
            let json = response.json();
            
            json.then((res) => {

                if(res[0].meta === undefined){

                    this.setResults("NOT A WORD");
                    return false;

                } else {

                    this.setResults("CORRECT!");
                    return true;
                }
                            
            }).catch((error) => {

                console.log('res error: ' + error);
            });

        } catch(error) {

            console.log(error);   
        } 
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
            
            if(!this.makeApiCall()){

                this.setResults("IS NOT A WORD");
                isCorrect = false;
            }

            if(isCorrect){

                this.setResults("CORRECT");
            }

            this.incrementPoints(isCorrect);
            return isCorrect;
        }

        this.setResults("MUST START GAME BEFORE YOU ENTER ANY WORDS");
        return false;
    }

    incrementPoints(isCorrect){

        if(isCorrect){

            let add = this.state.points + 100;
            this.setPoints(add);    
            
        } else {
            
            let subtract = this.state.points - 100;
            this.setPoints(subtract);
        }
    }

    setPoints(points){

        this.setState({points: points});
    }

    setResults(message){

        this.setState({results: message});
    }

    handleChange(event) {
    
        this.setState({checkedWord: event.target.value});
    }

    timeDisplay(){
        if(this.state.hasStarted){
            return(
                <button className="Start" onClick={this.startGame}>
                        START!
                </button>
            )
        } else {
            return(
                <div className="Start">
                    {this.state.time}
                </div>
            )
        }  
    }

    startGame(){
        this.setState({hasStarted : true})
    }

    startTimer(duration){

        var timer = duration, minutes, seconds;

        setInterval(function () {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.setState({time : minutes + " : " + seconds})

            if (--timer < 0) {

                timer = duration;
            }
        }, 1000);
    }
    
    render(){
        return(
            <div className="Word-solver">
                <div className="Letter-display">
                    {this.state.letters.map((letter) => {
                        return <div className="Single-Letter">{letter}</div>
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
                    {this.timeDisplay}
                </div>
            </div>
        )
    }
}

export default WordSolver;