import React, {useState, useEffect } from 'react';
import './Checkers.css';

const Space = ({id, spaceColor, handleClick, handleDoubleClick, piece}) => {

    return (
        <div 
            id={id}
            key={id} 
            className={spaceColor} 
            onClick={() => handleClick(id)}
            onDoubleClick={handleDoubleClick}>
            {piece}
        </div>   
    );
}

const Piece = ({color, id, isKing}) => {

    if(isKing){
        return (
            <button className={color} key={id}>
                <img 
                    src="https://toppng.com/uploads/preview/king-crown-transparent-115525054964mmviw8x6l.png"
                    width="20"
                    height="20"
                />
            </button>
        );
    } else {
        return (
            <button className={color} key={id}></button>
        );
    }
}

const Board = ({board, handleClick, handleDoubleClick}) => {

    useEffect(() => {
        console.log("BOARD IS GOING TO UPDATED")
    })

    if(board !== null){
        
       return board.map((row) => {
           
            let rowJSX = [];

            for(let i = 0; i <= 7; i++){
    
                let space = row[i];

                if(space.color === "WHITE"){

                    rowJSX.push(
                        <Space 
                            id={space.id}
                            key={space.id}   
                            spaceColor="Checkers-whiteSpace" 
                            handleClick={handleClick}
                            handleDoubleClick={handleDoubleClick}
                            piece={null}
                        />
                    );
                } else {

                    let piece = row[i].piece;

                    if(piece !== null){

                        let isKing = piece.status === "KING" ? true : false;
                        
                        if(piece.isSelected){

                            piece.pieceColor === "RED" ? 
                                piece = <Piece id={piece.id} isKing={isKing} color="Checkers-pieceRed-selected"/>:
                                piece = <Piece id={piece.id} isKing={isKing} color="Checkers-pieceWhite-selected"/>;

                        } else {

                            piece.pieceColor === "RED" ? 
                                piece = <Piece id={piece.id} isKing={isKing} color="Checkers-pieceRed"/>:
                                piece = <Piece id={piece.id} isKing={isKing} color="Checkers-pieceWhite"/>;
                        }
                    }

                    rowJSX.push(
                        <Space 
                            id={space.id}
                            key={space.id}   
                            spaceColor="Checkers-blackSpace" 
                            handleClick={handleClick} 
                            handleDoubleClick={handleDoubleClick}
                            piece={piece}
                        />
                    );
                }
            }
            return <div className="Checkers-row" key={board.indexOf(row)}>{rowJSX}</div>
        });
    } else {
        return <div>waiting on server</div>
    }


}

class Checkers extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            board : null,
            message : "SELECT A PIECE",
            turn : "WHITE",
            hasStarted : false
        }

        this.startGame = this.startGame.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.switchTurn = this.switchTurn.bind(this);
        this.setMessage = this.setMessage.bind(this);
    }

    componentDidMount(){

        console.log("COMPONENT MOUNTED");
        this.startGame();
    }

    async switchTurn(){

        await fetch("http://localhost:9000/CheckersServ/switchTurn", {

            mode : "cors",
            method : 'POST',

        }).then(res => { 

            let turn = this.state.turn;
            turn === "WHITE" ? turn = "RED" : turn = "WHITE";
            this.setState({turn : turn});

            return res.json() 
        
        }).then(json=> { 

            this.setState({board : json});

        }).catch(error => {

            console.log(error);
        });
    }

    async startGame(){

        await fetch("http://localhost:9000/CheckersServ").then(res => { return res.json() }).then(res => {

            this.setState({
                board : res,
                hasStarted : true
            });
            
        }).catch(error => { console.log(error) });
    } 
    
    async handleClick(id) {

        await fetch("http://localhost:9000/CheckersServ/handleClick", {

            headers: {
                'Content-Type': 'application/json'
            },
            mode : "cors",
            method : 'POST',
            body : JSON.stringify({ id : id }) 

        }).then(res => { return res.json() }).then(res => {

            this.setMessage(res.message);
            this.getBoard();
            
        }).catch(error => {

            console.log(error);
        });
    }

    async getBoard(){

        await fetch("http://localhost:9000/CheckersServ/getCheckers", {

            headers : {
                'Content-Type': 'application/json'
            },
            mode : "cors",
            method : "GET"

        }).then(res => { return res.json() }).then(json => {

            this.setState({board : json})

        }).catch(error => { console.log(error) })

    }

    async handleDoubleClick(){

        await fetch("http://localhost:9000/CheckersServ/handleDoubleClick", {

            headers : {
                'Content-Type': 'application/json'
            },
            mode : "cors",
            method : "POST"
            
        }).then(res => { return res.json(); }).then(json => {

            this.setState({ board : json})

        }).catch(error => {

            console.log(error)
        });

        this.setMessage("SELECT A PIECE");
    }

    setMessage(message){
        this.setState({message : message})
    }

    render(){

        console.log("RENDERING");

        return (
            <div className="Checkers-game">
                <div className="Checkers-sidebar">
                    <div className="Checkers-turn">Current Turn: {this.state.turn}</div>
                    <div className="Checkers-message">{this.state.message}</div>
                    <button className="Checkers-endTurn" onClick={this.switchTurn}> End Turn</button>
                </div>
                <div className="Checkers-board">
                    <Board board={this.state.board}  handleClick={this.handleClick} handleDoubleClick={this.handleDoubleClick}/>
                </div>
            </div>
        );
    }
}

export default Checkers;