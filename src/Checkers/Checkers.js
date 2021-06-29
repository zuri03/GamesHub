/*
todo
- refactor validatemove to simplify
- refactor code for readability and remove warnings
-fix error in validatemove
*/
import React from 'react';
import './Checkers.css'

function Space(props) {
    return (
        <div 
            id={props.id}
            key={props.id} 
            className={props.spaceColor} 
            onClick={(id) => props.handleClick(props.id)}
            onDoubleClick={props.handleDoubleClick}>
            {props.piece}
        </div>   
    );
}

function Piece(props){
    if(props.isKing){
        return (
            <button className={props.class} key={props.id}>
                    <img 
                        src="https://toppng.com/uploads/preview/king-crown-transparent-115525054964mmviw8x6l.png"
                        width="20"
                        height="20"
                    />
            </button>
        );
    } else {
        return (
            <button className={props.class} key={props.id}></button>
        );
    }
}

class Board extends React.Component {

    constructor(props){

        super(props);

        const rows = Array(8).fill(null);
        this.state = {

            spaces : Array(8).fill(null).map(() => rows.slice()),
            start: null,
            end: null,
            message: "SELECT PIECE",
            dictionary: {},

        };

        this.handleDoubleClick = this.handleDoubleClick.bind(this);

        class Space {

            constructor(id, piece, color){

                this.id = id;
                this.piece = piece;
                this.color = color;

            }
        }

        class Piece {

            constructor(id, pieceColor, status){

                this.id = id;
                this.pieceColor = pieceColor;
                this.status = status;
                this.makeKing = this.makeKing.bind(this);

            }

            makeKing(){this.status = "KING";}
        }

        var color = 0;
        var pieceIndex = 0;

        for(var i = 0; i < this.state.spaces.length; i++){

            let piece;
            
            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
            
                let coords = i.toString() + "," + j.toString();

                if(color === 0){
                    
                    this.state.spaces[i][j] = new Space((coords), null, "WHITE");
                    this.state.dictionary[coords] = null;
                    color++;

                } else {

                    if(i <= 2){

                        piece = new Piece(pieceIndex, "RED", "NORMAL");
                        this.state.dictionary[coords] = piece;
                        this.state.spaces[i][j] = new Space((coords), piece, "BLACK");
                        pieceIndex++;

                    } else if (i >= 5) {

                        piece = new Piece(pieceIndex, "WHITE", "NORMAL");
                        this.state.dictionary[coords] = piece;
                        this.state.spaces[i][j] = new Space((coords), piece, "BLACK");
                        pieceIndex++; 

                    } else {

                        this.state.dictionary[coords] = null;
                        this.state.spaces[i][j] = new Space((coords), null, "BLACK");

                    }
                    color--;
                }
                
            }
        }  
    }

    //Since different clicks can mean different things we need a function to handle individual clicks on a space
    async handleClick(id){

        //First check if the player has just selected a piece to move
        //If the player has picked a destination then this.state.start will not be null
        if(this.state.start === null){

            let piece = this.state.dictionary[id];

            //Make sure the piece the player wants to move is valid
            if(this.props.isValidMove(id, null, null, piece)){

                await this.setState({start: id});
            }   
        } else {

            //since set state is asynchronous it causes setstate to act weird, the await statement fixed that
            if(this.state.dictionary[id] === null){
                
                //Set the end state property
                await this.setState({end: id, message: null});

                //Make sure the move is valid if it is move the piece
                if(this.props.isValidMove(this.state.start, this.state.end, this.state.dictionary[this.getDiagonalPiece()], this.state.dictionary[this.state.start])){

                    this.movePiece();
                }       
            } 
        }   
    }

    handleDoubleClick() {

        //if a player wishes to move a different piece set everything to null
        this.setState({
            start: null,
            end: null,
            message: "SELECT A PIECE"
        });
    }

    getDiagonalPiece(){
        let gapIndex = [];
        
        //Based on the start and end position find the diagonal space in between and return the piece located there
        this.state.start[0] > this.state.end[0] ? //condition 
            gapIndex.push((parseInt(this.state.start[0]) - 1)) ://true
            gapIndex.push((parseInt(this.state.start[0]) + 1));//false

        this.state.start[2] > this.state.end[2] ? //condition 
            gapIndex.push((parseInt(this.state.start[2]) - 1)) ://true
            gapIndex.push((parseInt(this.state.start[2]) + 1));//false
      
        return gapIndex;
    }
    
    movePiece(){

        //Copy all of the necessary state properties 
        var startIndex = this.state.start;
        var endIndex = this.state.end;
        var movingPiece = this.state.dictionary[startIndex];
        var udpatedSpace = this.state.spaces;
        var updatedDiction = this.state.dictionary;   
        
        //Make the diagonal piece null to remove it
        if(Math.abs(endIndex[0] - startIndex[0]) > 1){
            this.state.dictionary[this.getDiagonalPiece()] = null;
        }
        
        //replace the destination space with a piece
        udpatedSpace[endIndex[0]][endIndex[2]].piece = movingPiece;

        //replace the original space with a null piece
        udpatedSpace[startIndex[0]][startIndex[2]].piece = null

        //update the state of the dictionary
        updatedDiction[this.state.start] = null;
        updatedDiction[this.state.end] = movingPiece;

        //If piece reaches the far side of the board make it a king piece since normal pieces cannot move backwards we do not need to check the color
        if(parseInt(this.state.end[0]) === 0 || parseInt(this.state.end[0]) === 7){

            if(movingPiece.status !== "KING"){

                movingPiece.makeKing();
            }
        }
          
        //update component state
        this.setState({

            spaces: udpatedSpace,
            dictionary: updatedDiction,
            start: null,
            end: null,
            message: "SELECT A PIECE"

        });                      
    }
    
    render() {

        let board = [];

        //generate a 2d array of JSX components  
        for(var i = 0; i <= 7; i++){

            //create a new row array for every row
            let rowArray = []

            for(var j = 0; j <= 7; j++){
                
                //Get a space object from the state
                let space = this.state.spaces[i][j];

                //Check properties of space object and make JSX component based on properties
                if(space.color === "WHITE"){

                    rowArray.push(
                        <Space 
                            id={space.id}
                            key={space.id}   
                            spaceColor="Checkers-whiteSpace" 
                            handleClick={(id) => this.handleClick(id)}
                            piece={null}
                        />
                    );

                } else {

                    //Get a piece object from state
                    let piece = this.state.dictionary[space.id];;

                    //If the space has a piece on it then we make a JSX object based on properties
                    if(piece !== null){

                        let isKing = piece.status === "KING" ? true : false;
                        
                        if(space.id === this.state.start){

                            piece.pieceColor === "RED" ? 
                                piece = <Piece id={piece.id} isKing={isKing} class="Checkers-pieceRed-selected"/>:
                                piece = <Piece id={piece.id} isKing={isKing} class="Checkers-pieceWhite-selected"/>;

                        } else {

                            piece.pieceColor === "RED" ? 
                                piece = <Piece id={piece.id} isKing={isKing} class="Checkers-pieceRed"/>:
                                piece = <Piece id={piece.id} isKing={isKing} class="Checkers-pieceWhite"/>;
                        }
                    }
                    
                    //Add space to row array
                    rowArray.push( 
                        <Space 
                            id={space.id}
                            key={space.id}   
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id) => this.handleClick(id)} 
                            handleDoubleClick={() => this.handleDoubleClick()}
                            piece={piece}
                        />
                    );

                }
            }
            board.push(rowArray);
        }
        
        //Return 2d array
        return (
            <div className="Checkers-board">
                {board.map((row) => {
                    return <div className="Checkers-row" key={board.indexOf(row)}>{row}</div>;
                })}
            </div>
        );
    }
}

class Checkers extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            currentTurn: 'WHITE',
            redPieces: 12,
            whitePieces: 12,
            message: "SELECT A PIECE",
            jumpingPiece: null
        }

        this.switchTurn = this.switchTurn.bind(this);

    }
    
    //Have to refactor to simplify
    //When making a double jump if the player selects an piece other than jump piece an error occurs
    isValidMove(start, end, diagPiece, movingPiece) {

        //First check if the player has already made a move this turn
        if(this.state.jumpingPiece !== null){
            
            //If the player selects a piece 'moving piece' that is not the same piece as the one already moved return false
            if(this.state.jumpingPiece !== movingPiece.id){

                this.setMessage("ONLY ALLOWED TO MAKE ANY AVAILABLE DOUBLE JUMPS");
                return false;
            }

            //If the player tries to make a second move that is not another jump return false
            if(diagPiece === null && end !== null){

                this.setMessage("ONLY ALLOWED TO MAKE ANY AVAILABLE DOUBLE JUMPS");
                return false;
            }
        }

        let isValidMove;

        //Check if the player has choosen a destination
        if(end !== null){

            //Check if the piece is a king piece normal pieces can only move forward
            if(movingPiece.status !== "KING"){

                //Based on the color of the piece the difference between the start and end row will be positive or negative
                if(movingPiece.pieceColor === "RED"){

                    if((start[0] - end[0]) > 0){

                        this.setMessage("CANNOT MOVE A NORMAL PIECE BACKWARDS");
                        return false;
                    }

                } else {

                    if((start[0] - end[0]) < 0){

                        this.setMessage("CANNOT MOVE A NORMAL PIECE BACKWARDS"); 
                        return false;
                    }
                }
            }

            //Check if this is a jump move, if diagPieceColor is not null then it is a jump move
            if(diagPiece === null){

               //If it is not a jump move make sure they do not try to move to a whitespace and that they only move forward on space
                isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&  
                                (Math.abs(start[0] - end[0]) === 1 && Math.abs(start[2] - end[2]) === 1);

            } else {

                //if it is a  jump move make sure they only make one jump at a time and that the piece they are jumping is an opponents piece
                isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&
                                ((Math.abs(end[0] - start[0]) === 2) && (Math.abs(end[2] - start[2])) === 2) &&
                                    (diagPiece.pieceColor !== this.state.currentTurn);

                //If the jump move is valid then removed an opponent's piece
                if(isValidMove){
                    
                    this.removePiece(diagPiece.pieceColor); 
                }
            } 

            //set the moving piece id to jumping piece in state so we can track to make sure the player only makes a double jump with the same piece
            if(isValidMove){

                let id = movingPiece.id;
                this.setState({jumpingPiece: id});

                //Also check if there is a winner
                this.findWinner();

            } else {

                this.setMessage("ILLEGAL MOVE");
            }

            return isValidMove; 
        }

        //If the player has not picked a destination then just make sure that they have picked a space with a piece on it
        if(movingPiece === null){

            this.setMessage("MUST SELECT A PIECE TO MOVE");
            return false;
        }
        
        //If the player has not picked a destination then make sure that the piece they have selected is not an opponent's piece
        isValidMove = movingPiece.pieceColor === this.state.currentTurn;

        if(!isValidMove){

            this.setMessage("CANNOT MOVE OPPONENT'S PIECE");
        }

        return isValidMove;
    }

    setMessage(newMessage){

        this.setState({message: newMessage});
    }

    removePiece(color){

        let pieces;

        if(color === "RED"){

            pieces = this.state.redPieces - 1;
            this.setState({redPieces: pieces});

        } else {

            pieces = this.state.whitePieces - 1;
            this.setState({whitePieces: pieces});
        }
    }

    findWinner(){   

        if(this.state.whitePieces === 0 || this.state.redPieces === 0){

            this.setState({currentTurn: "WE HAVE A WINNER"});
        } 
    }

    switchTurn(){

        let turn = this.state.currentTurn === "RED" ? "WHITE" : "RED";
        this.setState({currentTurn: turn, jumpingPiece: null});
        this.setMessage("SELECT A PIECE");  
    }

    render(){
 
        return(
            <div className="Checkers-game">
                <div className="Checkers-sidebar">
                    <div className="Checkers-turn">Current Turn: {this.state.currentTurn}</div>
                    <div className="Checkers-message">{this.state.message}</div>
                    <button className="Checkers-endTurn" onClick={this.switchTurn}> End Turn</button>
                </div>
                    <Board className="Checkers-board"
                        isValidMove={(start, end, diagPiece, movingPieceColor) => this.isValidMove(start, end, diagPiece, movingPieceColor)}
                    />
            </div>  
        )
    }
}

export default Checkers;