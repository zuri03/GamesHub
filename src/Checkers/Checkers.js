import React, {Component} from 'react';
import isValidMove from './Referee.js';

function Space(props) {
    return (
        <div 
            id={props.id} 
            className={props.spaceColor} 
            onClick={(id, piece) => props.handleClick(props.id, props.piece)}
            onDoubleClick={props.handleDoubleClick}> 
            {props.piece}
        </div>   
    );
}

function Piece(props){
    return (
       <button className={props.class} pieceColor={props.pieceColor}/>
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

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        
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

                        piece = <Piece id={pieceIndex} class="Checkers-pieceRed" pieceColor={"RED"}/>;
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)}
                            handleDoubleClick={this.handleDoubleClick} 
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        

                    } else if (i >= 5) {

                        piece = <Piece id={pieceIndex} class="Checkers-pieceWhite" pieceColor={"WHITE"}/>
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j} 
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)}
                            handleDoubleClick={() => this.handleDoubleClick()}
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        
                    } else {

                        this.state.dictionary[i + "," + j] = null;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece) => this.handleClick(id, piece)} 
                            handleDoubleClick={() => this.handleDoubleClick()}
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

            piece === null ? //condition
                this.setState({message: 'this space does not have a piece'}) ://true 
                await this.setState({start: id, message: null});//false
            
        } else {

            //since set state is asynchronous I ran into issues with updating the end property, the await statement fixed that
            if(this.state.dictionary[id] === null){
                
                await this.setState({end: id, message: null});

                isValidMove(this.state.start, this.state.end, this.getDiagonalPiece()) ?//condition
                    this.movePiece() ://true
                    this.setState({message: 'Illegal Move'});//false
        
            } else {
                this.setState({message: 'Cannot place piece here this space is full'});
            }
        }   
    }

    handleDoubleClick() {
        this.setState({
            start: null,
            end: null,
            message: null
        });
    }

    //gotta fix
    getDiagonalPiece(){
        var gapIndex = [];
        
        this.state.start.split(',')[0] > this.state.end.split(',')[0] ? //condition 
            gapIndex.push((parseInt(this.state.start.split(',')[0]) - 1).toString()) ://true
            gapIndex.push((parseInt(this.state.start.split(',')[0]) + 1).toString());//false
        
        this.state.start.split(',')[1] > this.state.end.split(',')[1] ? //condition 
            gapIndex.push((parseInt(this.state.start.split(',')[1]) - 1).toString()) ://true
            gapIndex.push((parseInt(this.state.start.split(',')[1]) + 1).toString());//false
      
        return this.state.dictionary[gapIndex.join()];
    }
    
    movePiece(){

        //Copy all of the necessary state properties 
        var startIndex = this.state.start.split(',');
        var endIndex = this.state.end.split(',');
        var movingPiece = this.state.dictionary[startIndex];
        var udpatedSpace = this.state.spaces;
        var updatedDiction = this.state.dictionary;

        //replace the destination space with a piece
        udpatedSpace[endIndex[0]][endIndex[1]] = null
        udpatedSpace[endIndex[0]][endIndex[1]] = <Space 
            id={this.state.end} 
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={this.state.dictionary[this.state.start.split(',')]}
        />;

        //replace the original space with a null piece
        updatedDiction[this.state.end] = this.state.dictionary[this.state.start];
        udpatedSpace[startIndex[0]][startIndex[1]] = null
        udpatedSpace[startIndex[0]][startIndex[1]] = <Space 
            id={this.state.start}  
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={null}
        />;

        //update the state of the dictionary
        updatedDiction[this.state.start] = null;
        updatedDiction[this.state.end] = movingPiece;
        
        //update component state
        this.setState({
            spaces: udpatedSpace,
            dictionary: updatedDiction,
            start: null,
            end: null,
        });                      
    }

    render() {
        let index = 0;
        let row;
        let board = this.state.spaces.map(() => {
            row = <div className="Checkers-row">{this.state.spaces[index]}</div>;
            index++;
            return row;
        })
        return (
            <div className="Checkers-board">
                {board}
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