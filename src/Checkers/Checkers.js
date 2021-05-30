import React from 'react';

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
    return (
       <button className={props.class} key={props.id}/>
    );
}

class Board extends React.Component {

    constructor(props){

        super(props);

        const rows = Array(8).fill(null);
        this.state = {
            spaces : Array(8).fill(null).map(() => rows.slice()),
            start: null,
            end: null,
            message: null,
            dictionary: {},
        };

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.isValidMove = this.props.isValidMove;
        
        var color = 0;
        var pieceIndex = 0;

        class Space {
            constructor(id, piece, color){
                this.id = id;
                this.piece = piece;
                this.color = color;
            }
        }

        class Piece {
            constructor(id, pieceColor){
                this.id = id;
                this.pieceColor = pieceColor;
            }
        }

        
        for(var i = 0; i < this.state.spaces.length; i++){

            var piece;
            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.state.spaces.length; j++){
                
                if(color === 0){
                    
                    this.state.spaces[i][j] = new Space((i + "," + j), null, "WHITE");
                    this.state.dictionary[i + "," + j] = null;
                    color++;
                    
                } else {

                    if(i <= 2){

                        piece = new Piece(pieceIndex, "RED");
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = new Space((i + "," + j), piece, "BLACK");
                        pieceIndex++;
                        

                    } else if (i >= 5) {

                        piece = new Piece(pieceIndex, "WHITE");
                        this.state.dictionary[i + "," + j] = piece;
                        this.state.spaces[i][j] = new Space((i + "," + j), piece, "BLACK");
                        pieceIndex++;
                        
                    } else {

                        this.state.dictionary[i + "," + j] = null;
                        this.state.spaces[i][j] = new Space((i + "," + j), null, "BLACK");
                    }
                    color--;
                }
            }
        }
    }

    async handleClick(id){
        
        var piece;

        if(this.state.start === null){

            piece = this.state.dictionary[id];
            piece === null ? //condition
                this.setState({message: 'this space does not have a piece'}) ://true 
                await this.setState({start: id, message: null});//false
            
        } else {

            //since set state is asynchronous it causes setstate to act weird, the await statement fixed that
            if(this.state.dictionary[id] === null){
                
                await this.setState({end: id, message: null});
                
                console.log('isvalidmove returned: ' + this.isValidMove(this.state.start, this.state.end, this.getDiagonalPiece()));
                
                this.isValidMove(this.state.start, this.state.end, this.getDiagonalPiece()) ?//condition
                    this.movePiece() ://true
                    this.setState({message: 'Illegal Move'});//false      
                /*
                await this.isValidMove(this.state.start, this.state.end, this.getDiagonalPiece()).then(res => {
                    res ? this.movePiece() : this.setState({message: 'Illegal Move'});
                })
                */
            
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
        udpatedSpace[endIndex[0]][endIndex[1]].piece = movingPiece;

        //replace the original space with a null piece
        udpatedSpace[startIndex[0]][startIndex[1]].piece = null

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

        let board = [];

        for(var i = 0; i <= 7; i++){

            let rowArray = []

            for(var j = 0; j <= 7; j++){

                let space = this.state.spaces[i][j];

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

                    let id = space.id.split(",");
                    let piece;

                    console.log('SPACE: ' + space.color)
                    piece = this.state.dictionary[space.id];

                    if(piece !== null){
                        piece.pieceColor === "RED" ? 
                            piece = <Piece id={piece.id} class="Checkers-pieceRed"/>:
                            piece = <Piece id={piece.id} class="Checkers-pieceWhite"/>
                    }

                    if(id[0] <= 2){

                        rowArray.push(
                            <Space 
                                id={space.id}
                                key={space.id}  
                                spaceColor="Checkers-blackSpace" 
                                handleClick={(id) => this.handleClick(id)}
                                handleDoubleClick={this.handleDoubleClick} 
                                piece={piece}
                            />
                        )
                    } else if(id[0] >= 5) {

                        rowArray.push(
                            <Space 
                                id={space.id}
                                key={space.id}   
                                spaceColor="Checkers-blackSpace" 
                                handleClick={(id) => this.handleClick(id)}
                                handleDoubleClick={this.handleDoubleClick} 
                                piece={piece}
                            />
                        );
                    } else {

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
            }
            board.push(rowArray);
        }
        
        const boardJSX = board.map((row) => {
            return <div className="Checkers-row" key={board.indexOf(row)}>{row}</div>;
        })
        return (
            <div className="Checkers-board">
                {boardJSX}
                <footer>{this.state.start} + {this.state.message} + {this.state.end}</footer>
            </div>
        );
    }
}

class Checkers extends React.Component {
    constructor(props){
        super(props);

        this.switchTurn = this.switchTurn.bind(this);

        this.state = {
            currentTurn: 'WHITE',
        }

    }
    
    async isValidMove(start, end, diagPiece) {
        
        var endIndex = end.split(',');
        var startIndex = start.split(',');
        var bool;
        console.log('isvalidmove called');

        if(diagPiece === null){
            bool = ((endIndex[0] % 2 === 0 && endIndex[1] % 2 === 0) || (endIndex[0] % 2 !== 0 && endIndex[1] % 2 !== 0)) &&  
                    (Math.abs(startIndex[0] - endIndex[0]) === 1 && Math.abs(startIndex[1] - endIndex[1]) === 1);
                    console.log('Bool: ' + bool);
            if(bool){
                console.log('set state reached');
                await this.switchTurn().then(res => {
                    return bool;
                });
            }
            return bool;
        } else {
            bool = ((Math.abs(endIndex[0] - startIndex[0]) === 2) && (Math.abs(endIndex[1] - startIndex[1])) === 2) &&
                    (diagPiece.color !== this.state.currentTurn);
                    console.log('Bool: ' + bool);
            if(bool){
                console.log('set state reached')
                await this.switchTurn().then(res => {
                    return bool;
                });
                /*
                switchTurn().then(res => {
                    return bool;
                });
                */
            }
            return bool;
        }    
    }

    async switchTurn () {
        var turn = this.state.currentTurn === "RED" ? "WHITE" : "RED";
        await this.setState({currentTurn: turn});
        return true;
    }

    render(){
        return(
            <div className="Checkers-game">
                <header className="Checkers-header">
                    {this.state.currentTurn}
                </header>
                    <Board isValidMove={(start, end, diagPiece) => this.isValidMove(end, start, diagPiece)}/>
            </div>
        )
    }
}

export default Checkers;