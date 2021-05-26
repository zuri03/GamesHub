import React, {Component} from 'react';

class Space extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            currentPiece : this.props.piece,
            spaceColor : this.props.spaceColor,
            index : this.props.index
        }
        this.getCurrentPiece = this.getCurrentPiece.bind(this);
    }

    //gotta fix, add event and target
    addPiece(piece) {
        this.setState ({
            currentPiece : piece
        })
    }

    getCurrentPiece(){
        return this.state.currentPiece;
    }

    render(){
        return (
            <div id={this.state.id} className={this.state.spaceColor} onClick={(id, piece) => this.props.handleClick(this.state.id, this.state.currentPiece)}>
                {this.state.currentPiece}
            </div>   
        );
    }
}

function Piece(props){
    return (
       <button className={props.pieceColor} onDragStart={props.drag} draggable="true"></button>
    );
}
class Board extends React.Component {

    constructor(props){

        super(props);

        const rows = Array(8).fill(null);
        this.state = {
            spaces : Array(8).fill(null).map(() => rows.slice()),
            start: null,//first click
            end: null,//second click
            message: null,
        };

        this.drag = this.drag.bind(this);
        
        var color = 0;
        var pieceIndex = 0;
        var spaceIndex = 0;
        for(var i = 0; i < this.state.spaces.length; i++){

            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                if(color === 0){
                    this.state.spaces[i][j] = <Space id={i + "," + j} key={spaceIndex} spaceColor="Checkers-whiteSpace" handleClick={(id, piece) => this.handleClick(id, piece)}/>
                    color++;
                } else {
                    if(i <= 2){
                        this.state.spaces[i][j] = <Space id={i + "," + j} key={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id, piece) => this.handleClick(id, piece)}
                            piece={<Piece id={pieceIndex} pieceColor="Checkers-pieceRed"/>}/>
                        pieceIndex++;
                    } else if (i >= 5) {
                        this.state.spaces[i][j] = <Space id={i + "," + j} key={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id, piece) => this.handleClick(id, piece)}
                            piece={<Piece id={pieceIndex} pieceColor="Checkers-pieceWhite"/>}/>
                        pieceIndex++;
                    } else {
                        this.state.spaces[i][j] = <Space id={i + "," + j} key={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id, piece) => this.handleClick(id, piece)} 
                            piece={null}/>
                    }
                    color--;
                }
                spaceIndex++;
            }
        }
    }

    handleClick(id, piece){

        console.log('Space id: ' + id);
        var space = this.state.spaces[id.split(',')[0]][id.split(',')[1]]

        if(this.state.start === null){

            if(piece === null){
                this.setState({message: 'this space does not have a piece'})
            } else {
                this.setState({
                    start: space,
                    message: null
                })
            }
            
        } else {
            if(piece === null){
                console.log('end: ' + id)
                this.setState({
                    end: id,
                    message: null
                })
                this.moveMade();
            } else {
                this.setState({message: 'Cannot place piece here this space is full'})
            }
        }    
    }

    moveMade(){
        /*
        if(isValidMove()){

        } else {
            return false;
        }
        */
    }
    drag(e) {
        e.dataTransfer.setData("Piece", e.target.id);
        console.log(e.target.id);
    }

    movePiece(){
        
    }

    render() {
        return (
            <div className="Checkers-board">
                <div className="Checkers-row">
                    {this.state.spaces[0]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[1]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[2]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[3]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[4]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[5]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[6]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[7]}
                </div>
                <footer>{this.state.start} + {this.state.message}</footer>
            </div>
        );
    }
}

class Checkers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render(){
        return(
            <div className="Checkers-game">
                <header className="Checkers-header">
                    CHECKERS!
                </header>
                    <Board/>
            </div>
        )
    }
}

export default Checkers;