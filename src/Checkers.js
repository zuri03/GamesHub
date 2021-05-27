import React, {Component} from 'react';

class Space extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            id: props.id,
            piece: props.piece
        }
    }
    render() {
        return (
            <div id={this.state.id} className={this.props.spaceColor} onClick={(id, piece) => this.props.handleClick(this.state.id, this.state.piece)}> 
                {this.props.piece}
            </div>   
        );  
    }  
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
            pieces: [],
            start: null,//first click
            end: null,//second click
            message: null,
            dictionary: {},
        };
        
        var color = 0;
        var pieceIndex = 0;
        var spaceIndex = 0;
        
        for(var i = 0; i < this.state.spaces.length; i++){

            var piece;
            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                
                if(color === 0){

                    this.state.spaces[i][j] = <Space 
                        id={i + "," + j}  
                        spaceColor="Checkers-whiteSpace" 
                        handleClick={(id, piece, key) => this.handleClick(id, piece, key)}
                        piece={null}
                    />;
                    this.state.dictionary[i + "," + j] = null;
                    color++;
                    
                } else {
                    if(i <= 2){

                        piece = <Piece id={pieceIndex} pieceColor="Checkers-pieceRed"/>;
                        this.state.pieces.push(piece);
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece, key) => this.handleClick(id, piece, key)} 
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        

                    } else if (i >= 5) {

                        piece = <Piece id={pieceIndex} pieceColor="Checkers-pieceWhite"/>
                        this.state.pieces.push(piece);
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j} 
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece, key) => this.handleClick(id, piece, key)}
                            piece={this.state.dictionary[i + "," + j]}
                        />;
                        pieceIndex++;
                        

                    } else {

                        this.state.dictionary[i + "," + j] = null;
                        this.state.spaces[i][j] = <Space 
                            id={i + "," + j}  
                            spaceColor="Checkers-blackSpace" 
                            handleClick={(id, piece, key) => this.handleClick(id, piece, key)} 
                            piece={null}
                        />;   
                    }
                    color--;
                }
                spaceIndex++;
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
            
            if(this.state.dictionary[id] === null){
                await this.setState({
                    end: id,
                    message: null
                });
                this.movePiece();
            } else {
                this.setState({message: 'Cannot place piece here this space is full'});
            }
        }   
    }
    
    movePiece(){
        console.log('Indexes: ' + this.state.start.split(','));
        var newSpaces = this.state.spaces;

        newSpaces[this.state.end.split(',')[0]][this.state.end.split(',')[1]] = null
        newSpaces[this.state.end.split(',')[0]][this.state.end.split(',')[1]] = <Space 
            id={this.state.end} 
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={this.state.dictionary[this.state.start.split(',')]}
        />;
        this.state.dictionary[this.state.end] = this.state.dictionary[this.state.start];
        newSpaces[this.state.start.split(',')[0]][this.state.start.split(',')[1]] = null
        newSpaces[this.state.start.split(',')[0]][this.state.start.split(',')[1]] = <Space 
            id={this.state.start}  
            spaceColor="Checkers-blackSpace" 
            handleClick={(id, piece) => this.handleClick(id, piece)} 
            piece={null}
        />;
        this.state.dictionary[this.state.start] = null;
        this.setState({
            spaces: newSpaces
        })
        this.forceUpdate();
        this.setState({
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