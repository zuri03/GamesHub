
class Board{
    
    constructor(){

        class Space {

            constructor(id, piece, color){

                this.id = id;
                this.piece = piece;
                this.color = color;
            }
        }

        class Piece {

            constructor(id, pieceColor, status, spaceCoords){

                this.id = id;
                this.pieceColor = pieceColor;
                this.status = status;
                this.makeKing = this.makeKing.bind(this);
                this.spaceCoords = spaceCoords;
                this.isSelected = false;
            }

            makeKing(){

                this.status = "KING";
            }
        }

        const rows = Array(8).fill(null);

        this.board = Array(8).fill(null).map(() => rows.slice())
        this.turn = "WHTE";
        this.whitePieces = 12;
        this.redPieces = 12;
        this.jumpingPiece = null;
        this.start = null;
        this.end = null;

        let color = 0;
        let pieceIndex = 0;

        for(var i = 0; i < this.board.length; i++){

            let piece;
            
            color = (i % 2) === 0 ? 1 : 0;

            for(var j = 0; j < this.board.length; j++){
            
                let coords = i.toString() + "," + j.toString();

                if(color === 0){
                    
                    this.board[i][j] = new Space(coords, null, "WHITE");
                    color++;

                } else {

                    if(i <= 2){

                        piece = new Piece(pieceIndex, "RED", "NORMAL", coords);
                        this.board[i][j] = new Space(coords, piece, "BLACK");
                        pieceIndex++;

                    } else if (i >= 5) {

                        piece = new Piece(pieceIndex, "WHITE", "NORMAL", coords);
                        this.board[i][j] = new Space(coords, piece, "BLACK");
                        pieceIndex++; 

                    } else {

                        this.board[i][j] = new Space(coords, null, "BLACK");
                    }

                    color--;
                }      
            }
        }  
    }

    handleClick(id){
        
        if(this.start === null){

            if(this.isValidMove(id, null)){

                this.start = id;
                return true;

            } else {

                return false;
            }
            
        } else {

            if(this.isValidMove(this.start, id)){

                this.end = id;
                return true;

            } else {

                return false;
            }
        }  
    }

    resetSelected(){

        this.start = null;
        this.end = null;
    }

    isValidMove(start, end) {

        let returnObj = {

            isValidMove : false,
            message : "INVALID MOVE"
        }

        let movingPiece = this.board[start[0]][start[2]];

        if(this.checkIfWhiteSpace(start, end)){

            return returnObj;
        }

        if(this.isOpponentPiece(movingPiece)){

            return returnObj;
        }

        if(!this.enforceDoubleJumpisAvailable(movingPiece, start, end)){

            return returnObj;
        }

        if(movingPiece.status !== "KING" && !this.noBackwardsMovement(movingPiece)){

            return returnObj;
        }

        if(end !== null){ 

            let coords = this.getDiagonalPiece(start, end);
            let diagPiece = this.board[coords[0]][coords[1]];

            if(diagPiece === null){

                returnObj.isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&  
                                        (Math.abs(start[0] - end[0]) === 1 && Math.abs(start[2] - end[2]) === 1);
            } else {

                returnObj.isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&
                                        ((Math.abs(end[0] - start[0]) === 2) && (Math.abs(end[2] - start[2])) === 2) &&
                                        (diagPiece.pieceColor !== this.turn);

                if(returnObj.isValidMove){
            
                    this.removePiece(diagPiece.pieceColor); 
                }
            }
        }

        if(returnObj.isValidMove){

            this.movePiece(start, end);
            this.jumpingPiece = movingPiece.id;
            returnObj.message = "VALID MOVE";
        }

        if(this.findWinner){

            returnObj.isValidMove = true;
            returnObj.message = "WE HAVE A WINNER";
        }

        return returnObj;  
    }

    enforceDoubleJumpifAvailable(movingPiece, start, end){

        if(this.jumpingPiece !== null){

            if(this.jumpingPiece === movingPiece.id){

                if(end !== null){

                    let diagPiece = this.getDiagonalPiece(start, end);

                    if(diagPiece !== null){
                        
                        if(diagPiece.pieceColor !== movingPiece.pieceColor) {

                            return true;
                        }
                    }
                }

                return true;
            }
        } 

        return false;
    }

    checkIfWhiteSpace(start, end){
        if(end === null) 
            return this.board[start[0]][start[2]].color !== "WHITE";
        else 
            return this.board[start[0]][start[2]].color !== "WHITE" && this.board[end[0]][end[2]].color !== "WHITE";
    }

    findWinner(){  

        return this.whitePieces === 0 || this.redPieces === 0;
    }

    removePiece(color){

        color === "RED" ?  this.redPieces -= 1 : this.whitePieces -= 1;
    }

    getDiagonalPiece(start, end){

        let gapIndex = [];

        start[0] > end[0] ? 
            gapIndex.push((parseInt(start[0]) - 1)) :
            gapIndex.push((parseInt(start[0]) + 1));

        start[2] > end[2] ? 
            gapIndex.push((parseInt(start[2]) - 1)) :
            gapIndex.push((parseInt(start[2]) + 1));
      
        return gapIndex;
    }

    movePiece(start, end){
 
        let movingPiece = this.board[start[0]][start[2]].piece; 
 
        if(Math.abs(endIndex[0] - startIndex[0]) > 1){

            let coords = this.getDiagonalPiece(start, end);
            this.board[coords[0]][coords[1]] = null;
        }
        
        this.board[end[0]][end[2]].piece = movingPiece;
        this.board[start[0]][start[2]].piece = null

        if(parseInt(end[0]) === 0 || parseInt(end[0]) === 7){

            if(movingPiece.status !== "KING"){

                movingPiece.makeKing();
            }
        }                     
    }

    noBackwardsMovement(movingPiece){

        if(movingPiece.pieceColor === "RED"){

            if((start[0] - end[0]) > 0){

                return false;
            }

        } else {

            if((start[0] - end[0]) < 0){

                return false;
            }
        }

        return true;
    }

    getBoard(){

        return this.board; 
    }

    switchTurn(){ 

        this.turn === "WHITE" ? this.turn = "RED" : this.turn = "WHITE";
    }

    isOpponentPiece(movingPiece){

        return movingPiece.pieceColor !== this.turn;
    }
    
}

class Checkers {

    constructor(){
        this.board = null
    }

    startGame(){
        this.board = new Board();
    }

    getBoard(){
        return this.board.getBoard();
    }

    endGame(){
        this.board = null
    }

    handleClick(id){
        return this.board.handleClick(id);
    }
}

var game = new Checkers();

module.exports = game;