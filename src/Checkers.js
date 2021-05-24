import React, {Component} from 'react';

class Space extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPiece : null,
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
            <button className={this.state.spaceColor}>{this.state.index}</button>   
        );
    }
}

function Piece(props){
    return (
       <button className="Checkers-piece"></button>
    );
}
class Board extends React.Component {

    constructor(props){
        super(props);
        const rows = Array(8).fill(null);
        this.state = {
            spaces : Array(8).fill(null).map(() => rows.slice())
        };
        
        var color = 0;
        for(var i = 0; i < this.state.spaces.length; i++){

            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                if(color === 0){
                    this.state.spaces[i][j] = <Space spaceColor="Checkers-whiteSpace" index={i + ", " + j} />
                    color++;
                } else if (color === 1){
                    this.state.spaces[i][j] = <Space spaceColor="Checkers-blackSpace" index={i + ", " + j} />
                    color--;
                }
            }
        }
    }

    render() {
        return (
            <div className="Checkers-board">
                <div className="Checkers-row">
                    {this.state.spaces[0]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[1]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[2]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[3]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[4]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[5]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[6]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[7]}
                </div>
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
                    CHECKERS!!!!!
                </header>
                <body>
                    <Board/>
                </body>
            </div>
        )
    }
}

export default Checkers;