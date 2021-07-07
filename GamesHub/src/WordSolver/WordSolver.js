import React from 'react';
import './WordSolver.css';

class WordSolver extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            letters : [],
            results: "",
            checkedWord: null,
            points: 0,
            time: null,
            seconds: 180,
            hasStarted: false
        }

        //Cancel time is a variable returned by set interval that allows use to end the set interval method
        this.cancelTime = 0;

        //Points boost increases the amount of points for every correct word 
        this.pointsBoost = 1;

        this.handleChange = this.handleChange.bind(this);
        this.setResults = this.setResults.bind(this);
        this.incrementPoints = this.incrementPoints.bind(this);
        this.startGame = this.startGame.bind(this);
        this.secondsToTime = this.secondsToTime.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    async checkWord(event){

        event.preventDefault();

        //First check if the game has started
        if(this.state.hasStarted){
            
            await fetch("http://localhost:9000/WordSolverServ/submitWord", {

                headers: {
                    'Content-Type': 'application/json'
                },
                mode : "cors",
                method : 'POST',
                body : JSON.stringify({ submittedWord : this.state.checkedWord })

            }).then(res => { return res.text() }).then(text => {

                text ? this.incrementPoints(true) : this.incrementPoints(false);

            }).catch(error => {

                console.log(error)
            });
           
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

    async startGame(){

        this.setState({ hasStarted : true });
        this.startTimer();
        
        await fetch("http://localhost:9000/WordSolverServ/startGame").then(res => { return res.json() }).then(json => {

            this.setState({ letters : json });

        }).catch(error => console.log(error))
    }

    startTimer(){

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
        
        let inputValue;

        if (!this.state.checkedWord) {
            inputValue = ""
        } else {
            inputValue = this.state.checkedWord
        }

        return(
            <div className="Word-solver">
                <div className="Letter-display">
                    {this.state.letters.map((letter) => {
                        return <div className="Single-Letter" key={`${Math.floor(Math.random() * 1000)}:${letter}`}>{letter.toUpperCase()}</div>
                    })}
                </div>
                <div className="Input">
                    <form onSubmit={(e) => this.checkWord(e)}>
                        <label>Word:
                            <input type="text" value={inputValue} onChange={this.handleChange} name="name" placeholder="Enter Here" />
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