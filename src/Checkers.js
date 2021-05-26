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
    }

    //gotta fix, add event and target
    addPiece(piece) {
        this.setState ({
            currentPiece : piece
        })
    }

    render(){
        return (
            <button id={this.state.id} className={this.state.spaceColor} onClick={(id) => this.props.handleClick(this.state.id)}>
                {this.state.currentPiece}
            </button>   
        );
    }
}

function Piece(props){
    return (
       <button className={props.pieceColor} ondragStart={props.drag} draggable="true"></button>
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
        };

        this.drag = this.drag.bind(this);
        
        var color = 0;
        var pieceIndex = 0;
        var spaceIndex = 0;
        for(var i = 0; i < this.state.spaces.length; i++){

            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                if(color === 0){
                    this.state.spaces[i][j] = <Space id={spaceIndex} spaceColor="Checkers-whiteSpace"/>
                    color++;
                } else {
                    if(i <= 2){
                        this.state.spaces[i][j] = <Space id={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id) => this.handleClick(id)}
                            piece={<Piece id={pieceIndex} pieceColor="Checkers-pieceRed"/>}/>
                        pieceIndex++;
                    } else if (i >= 5) {
                        this.state.spaces[i][j] = <Space id={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id) => this.handleClick(id)}
                            piece={<Piece id={pieceIndex} pieceColor="Checkers-pieceWhite"/>}/>
                        pieceIndex++;
                    } else {
                        this.state.spaces[i][j] = <Space id={spaceIndex} spaceColor="Checkers-blackSpace" handleClick={(id) => this.handleClick(id)} 
                            piece={null}/>
                    }
                    color--;
                }
                spaceIndex++;
            }
        }
    }

    handleClick(id){
        console.log('Space id: ' + id);
        
        if(this.state.start === null){
            this.setState({start: id})
        } else {
            this.setState({end: id})
            //this.moveMade();
        }
        
    }

    moveMade(){
        
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
                <footer>start = {this.state.start} + {this.state.end}</footer>
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
                <body>
                    <Board/>
                </body>
            </div>
        )
    }
}

export default Checkers;