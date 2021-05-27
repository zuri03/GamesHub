import React, {Component} from 'react';
import validateMove from './Referee.js';

function Space(props) {
    return (
        <div id={props.id} className={props.spaceColor} onClick={(id, piece) => props.handleClick(props.id, props.piece)}> 
            {props.piece}
        </div>   
    );
}

function Piece(props){
    return (
       <button className={props.pieceColor}/>
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
            message: null,//lets the player know if a move was successful or if they have made a mistake
            dictionary: {},
        };
        
        var color = 0;
        var pieceIndex = 0;
        
        for(var i = 0; i < this.state.spaces.length; i++){

            var piece;
            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                
                if(color === 0){

                    this.state.spaces[i][j] = <Space 
                        id={i + "," + j}  
                        spaceColor="Checkers-whiteSpace" 
                        handleClick={(id, piece) => this.handleClick(id, piece)}
                        piece={null}
                    />;
                    this.state.dictionary[i + "," + j] = null;
                    color++;
                    
                } else {
                    if(i <= 2){

                        piece = <Piece id={pieceIndex} pieceColor="Checkers-pieceRed"/>;
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)} 
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        

                    } else if (i >= 5) {

                        piece = <Piece id={pieceIndex} pieceColor="Checkers-pieceWhite"/>
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j} 
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)}
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        
                    } else {

                        this.state.dictionary[i + "," + j] = null;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)} 
                            piece={null}
                        />;   
                    }
                    color--;
                }
            }
        }
    }

    async handleClick(id, piece){
        
        if(this.state.start === null){
            if(piece === null){
                this.setState({message: 'this space does not have a piece'});
            } else {
                await this.setState({
                    start: id,
                    message: null
                });
            }
        } else {
            //since set state is asynchronous I ran into issues with updating the end property, the await statement fixed that
            if(this.state.dictionary[id] === null){
                
                console.log('Before Validate:\n ' + 'start: ' + this.state.start + '\n end: ' + this.state.end);
                await this.setState({
                    end: id,
                    message: null
                });
                if(validateMove(this.state.start, this.state.end)){
                    this.movePiece();
                } else {
                    this.setState({message: 'Illegal Move'})
                }
            } else {
                this.setState({message: 'Cannot place piece here this space is full'});
            }
        }   
    }
    
    movePiece(){
        //When attempting to move the same piece twice I get the screenshotted error
        var startIndex = this.state.start.split(',');
        var endIndex = this.state.end.split(',');
        var movingPiece = this.state.dictionary[startIndex];
        var udpatedSpace = this.state.spaces;
        var updatedDiction = this.state.dictionary;

        udpatedSpace[endIndex[0]][endIndex[1]] = null
        udpatedSpace[endIndex[0]][endIndex[1]] = <Space 
            id={this.state.end} 
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={this.state.dictionary[this.state.start.split(',')]}
        />;

        updatedDiction[this.state.end] = this.state.dictionary[this.state.start];
        udpatedSpace[startIndex[0]][startIndex[1]] = null
        udpatedSpace[startIndex[0]][startIndex[1]] = <Space 
            id={this.state.start}  
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={null}
        />;

        updatedDiction[this.state.start] = null;
        updatedDiction[this.state.end] = movingPiece;
        
        this.setState({
            spaces: udpatedSpace,
            dictionary: updatedDiction,
            start: null,
            end: null,
        });                      
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
                <footer>{this.state.start} + {this.state.message} + {this.state.end}</footer>
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