
class WordSolver {

    constructor(){

        this.letters = [];
        
        let chars = "abcdefghijklmnopqrstuvwxyz";
        let vowels = "aeiou";

        this.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
        this.letters.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));

        //Generate six more random letters for a total of eight 
        for(let i = 1; i <= 6; i++){
            
            this.letters.push(chars.charAt(Math.floor(Math.random() * chars.length)))
        }

        //Points boost increases the amount of points for every correct word 
        this.pointsBoost = 1;

        //An array of words the player has already used
        this.submittedWords = [];
    }

    async checkWord(word){

        let result = {
            isCorrect : true,
            message : "Correct Word"
        }

        //For every character in the word the player has submitted we run a series of tests
        for(let i = 0; i < word.length; i++){

            if(!this.letters.includes(word[i])){
                result.message = "ONE OR MORE LETTERS ARE NOT CURRENTLY ALLOWED";
                result.isCorrect = false;
            }

            if(!isNaN(word[i])){
                reesult.message = "ONLY LETTERS ALLOWED";
                result.isCorrect = false;
            }

            if(!(/[a-z]/).test(word[i])){
                result.message = "NO PUNCUATION ALLOWED";
                result.isCorrect = false;
            }
        }

        //Check if the player has submitted a word that has been previously submitted
        if(this.submittedWords.find(element => element === word) !== undefined){

            result.isCorrect = false;
            result.message = "YOU HAVE ALREADY SUBMITTED THIS WORD";
        }
        
        if(result.isCorrect){

            try{

                //Send a call to meriam API
                const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${this.state.checkedWord}?key=3d9a89de-d4ee-44bc-b1ad-cd8b9f10e0c8`);
                
                let json = response.json();
                
                //This is a weird way to check if it is a correct word
                //However if the json contains a meta section then the word is a correct english word
                json.then((res) => {
    
                    if(res[0].meta === undefined){
    
                        result.isCorrect = false;
                        result.message = "NOT A WORD"
                        return result;
    
                    } else {
                        this.submittedWords.push(this.state.checkedWord);
                        return result;
                    }
                                
                }).catch((error) => {
    
                    console.log('res error: ' + error);
                });
    
            } catch(error) {
    
                console.log(error);   
            } 
        } else {
            
            return result;
        }

        
    }

    getLetters(){ return this.letters }
}

module.exports = WordSolver;