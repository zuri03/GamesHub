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
            pointsBoost: 1
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

        for(let i = 0; i < this.state.checkedWord.length; i++){

            if(!this.state.letters.includes(this.state.checkedWord[i])){

                this.setResults("ONE OR MORE LETTERS ARE NOT CURRENTLY ALLOWED");
                return false;
            }

            if(!isNaN(this.state.checkedWord[i])){

                this.setResults("ONLY LETTERS ALLOWED");
                return false
            }

            if(!(/[a-z]/).test(this.state.checkedWord[i])){

                this.setResults("NO PUNCUATION ALLOWED");
                return false;
            }
        }
        
        if(!this.makeApiCall()){

            this.setResults("IS NOT A WORD");
            return false;
        }

        this.setResults("CORRECT");
        return true;
    }

    incrementScore(isCorrect){
        
        let pointsMade = 100;

        if(isCorrect){

            let add = this.state.points + 100;
            this.setScore(add);    
        } else {
            
            let subtract = this.state.points - 100;
            this.setScore(subtract);
        }
    }

    setScore(points){

        this.setState({points: points});
    }

    setResults(message){

        this.setState({results: message});
    }

    handleChange(event) {
    
        this.setState({checkedWord: event.target.value});
    }
    
    render(){
        return(
            <div>
                <div className="Letter-display">
                    {this.state.letters.map((letter) => {
                        return <div className="Single-Letter">{letter}</div>
                    })}
                </div>
                <div>
                    <form onSubmit={(e) => this.checkWord(e)}>
                        <label>Word:
                            <input type="text" value={this.state.checkedWord} onChange={this.handleChange} name="name" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                    <div>{this.state.results}</div>
                </div>
            </div>
        )
    }
}

export default WordSolver;