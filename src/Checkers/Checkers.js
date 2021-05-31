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
                
                let coords = i.toString() + "," + j.toString();
                if(color === 0){
                    
                    this.state.spaces[i][j] = new Space((coords), null, "WHITE");
                    this.state.dictionary[coords] = null;
                    color++;
                    
                } else {

                    if(i <= 2){

                        piece = new Piece(pieceIndex, "RED");
                        this.state.dictionary[coords] = piece;
                        this.state.spaces[i][j] = new Space((coords), piece, "BLACK");
                        pieceIndex++;
                        

                    } else if (i >= 5) {

                        piece = new Piece(pieceIndex, "WHITE");
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

    async handleClick(id){
        
        var piece;

        if(this.state.start === null){

            piece = this.state.dictionary[id];
            /*
            if(piece === null){
                this.setState({message: 'this space does not have a piece'})
            } else {
                await this.setState({start: id, message: null});
                
                
                if(this.props.notOpponentPiece(piece.pieceColor)){
                    await this.setState({start: id, message: null});
                } else {
                    this.setState({message: 'You cannot move a piece of the opposite color'}) 
                }
                
                
            }
            */

            piece === null ? //condition
                this.setState({message: 'this space does not have a piece'}) ://true 
                await this.setState({start: id, message: null});//false
            
            
        } else {

            //since set state is asynchronous it causes setstate to act weird, the await statement fixed that
            if(this.state.dictionary[id] === null){
                
                await this.setState({end: id, message: null});
            
                this.props.isValidMove(this.state.start, this.state.end, this.getDiagonalPiece(), this.state.dictionary[this.state.start].pieceColor) ?//condition
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
        
        this.state.start[0] > this.state.end[0] ? //condition 
            gapIndex.push((parseInt(this.state.start[0]) - 1)) ://true
            gapIndex.push((parseInt(this.state.start[0]) + 1));//false

        this.state.start[2] > this.state.end[2] ? //condition 
            gapIndex.push((parseInt(this.state.start[2]) - 1)) ://true
            gapIndex.push((parseInt(this.state.start[2]) + 1));//false
      
        return this.state.dictionary[gapIndex];
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

        this.state = {
            currentTurn: 'WHITE',
        }

    }
    
    isValidMove(start, end, diagPieceColor, movingPieceColor) {

        var isValidMove;
        console.log('Current Turn: ' + this.state.currentTurn);

        if(movingPieceColor === this.state.currentTurn){

            console.log('THEY ARE THE SAME COLOR');

            if(diagPieceColor === null){

                console.log('DIAG PIECE IS NULL');

                isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&  
                        (Math.abs(start[0] - end[0]) === 1 && Math.abs(start[2] - end[2]) === 1);
            } else {

                console.log('DIAG PIECE IS NOT NULL');

                isValidMove = ((Math.abs(end[0] - start[0]) === 2) && (Math.abs(end[2] - start[2])) === 2) &&
                        (diagPieceColor !== this.state.currentTurn);
            }  
            if(isValidMove){
                    
                var turn = this.state.currentTurn === "RED" ? "WHITE" : "RED";
                this.setState({currentTurn: turn});
            }
        } else {

            console.log('THEY ARE NOT THE SAME COLOR');
            isValidMove = false;
        }

        console.log('RETURNING: ' + isValidMove);
        return isValidMove; 
    }

    
    notOpponentPiece(color){
        return color === this.state.currentTurn;
    }
    

    render(){
        return(
            <div className="Checkers-game">
                <header className="Checkers-header">
                    {this.state.currentTurn}
                </header>
                    <Board 
                        isValidMove={(start, end, diagPieceColor, movingPieceColor) => this.isValidMove(end, start, diagPieceColor, movingPieceColor)}
                        //notOpponentPiece={this.notOpponentPiece}
                    />
            </div>
        )
    }
}

export default Checkers;