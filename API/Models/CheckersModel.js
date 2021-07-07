//Must refactor to simplify
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

            constructor(id, pieceColor, status){

                this.id = id;
                this.pieceColor = pieceColor;
                this.status = status;
                this.makeKing = this.makeKing.bind(this);
                this.isSelected = false;
            }

            makeKing(){

                this.status = "KING";
            }
        }

        const rows = Array(8).fill(null);

        this.board = Array(8).fill(null).map(() => rows.slice())
        this.turn = "WHITE";
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

                        piece = new Piece(pieceIndex, "RED", "NORMAL");
                        this.board[i][j] = new Space(coords, piece, "BLACK");
                        pieceIndex++;

                    } else if (i >= 5) {

                        piece = new Piece(pieceIndex, "WHITE", "NORMAL");
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

            let result = this.isValidController(id, null);

            if(result.isValidMove){

                this.start = id;
                return result

            } else {

                return result;
            }
            
        } else {

            let result = this.isValidController(this.start, id);

            if(result.isValidMove){

                this.end = id;
                return result

            } else {

                return result
            }
        }  
    }

    resetSelected(){

        this.start = null;
        this.end = null;

        for(let i = 0; i < this.board.length; i++){

            for(let j = 0; j < this.board[i].length; j++){

                let piece = this.board[i][j].piece;
                if(piece !== null){
                    piece.isSelected = false;
                }
            }
        }
    }

    isValidMove(start, end, movingPiece){

        let result = {

            isValidMove : false,
            message : "INVALID MOVE"
        }

        if(this.checkIfWhiteSpace(start, end)){

            result.message = "NOT ALLOWED TO MOVE TO WHITE SPACE";
            return result;
        }

        if(this.isOpponentPiece(movingPiece)){

            result.message = "YOU CANNOT MOVE AN OPPONENT'S PIECE";
            return result;
        }

        if(this.enforceDoubleJumpifAvailable(movingPiece, start, end)){

            console.log("INVLAID DOUBLE JUMP")

            result.message = "YOU HAVE ALREADY MOVED ONCE THIS TURN YOU MUST EITHER MAKE ANY AVAILABLE JUMP MOVES OR END YOUR TURN";
            return result;
        }

        let coords = this.getDiagonalPiece(start, end);
        let diagPiece = this.board[coords[0]][coords[1]].piece;

        if(movingPiece.status !== "KING" && !this.noBackwardsMovement(movingPiece, start, end)){

            result.message = "YOU ARE NOT ALLOWED TO MOVE THAT PIECE BACKWARDS";
            return result;
        }

        if(diagPiece === null){

            result.isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&  
                                    (Math.abs(start[0] - end[0]) === 1 && Math.abs(start[2] - end[2]) === 1);
            
        } else {

            result.isValidMove = ((end[0] % 2 === 0 && end[2] % 2 === 0) || (end[0] % 2 !== 0 && end[2] % 2 !== 0)) &&
                                    ((Math.abs(end[0] - start[0]) === 2) && (Math.abs(end[2] - start[2])) === 2) &&
                                    (diagPiece.pieceColor !== this.turn);

            if(result.isValidMove){
        
                this.removePiece(diagPiece.pieceColor); 
            }
        }

        return result

    }

    isValidPiece(start, movingPiece){

        let result = {

            isValidMove : false,
            message : "INVALID MOVE"
        }

        if(movingPiece === null){
            
            result.message = "Must Select A Space With A Piece"
            return result;
        }

        if(this.jumpingPiece === null){

            if(this.checkIfWhiteSpace(start, null)){

                result.message = "NOT ALLOWED TO MOVE TO WHITE SPACE";
                return result
            }

            if(this.isOpponentPiece(movingPiece)){

                result.message = "YOU CANNOT MOVE AN OPPONENT'S PIECE";
                return result
            }

        } else {

            if(movingPiece.id !== this.jumpingPiece){

                result.message = "ONLT ALLOWED TO MAKE DOUBLE JUMP WITH PIECE THAT HAS ALREADY MOVED"
                return result
            }
        }

        result.isValidMove = true;
        result.message = "VALID MOVE"
        movingPiece.isSelected = true;

        return result;
    }

    isValidController(start, end) {

        var movingPiece = this.board[start[0]][start[2]].piece;

        if(end === null){

            return this.isValidPiece(start, movingPiece);

        } else {

            let result = this.isValidMove(start, end, movingPiece);

            if(result.isValidMove){

                this.movePiece(start, end, movingPiece);
                this.jumpingPiece = movingPiece.id;
                result.message = "VALID MOVE";
                this.resetSelected();
            }

            if(this.findWinner()){

                returnObj.isValidMove = true;
                returnObj.message = "WE HAVE A WINNER";
            }
    
            return result; 
        } 
    }

    enforceDoubleJumpifAvailable(movingPiece, start, end){

        if(this.jumpingPiece !== null){

            if(this.jumpingPiece !== movingPiece.id){

                return true;
                
            } else {

                if(end !== null){

                    let coords = this.getDiagonalPiece(start, end);
                    let diagPiece = this.board[coords[0]][coords[1]].piece;

                    if(diagPiece === null){

                        return true;
                        
                    } else {

                        if(diagPiece.pieceColor === movingPiece.pieceColor) {

                            return true;
                        }
                    }
                }

            }
        } 

        return false;
    }

    checkIfWhiteSpace(start, end){
        if(end === null) 
            return this.board[start[0]][start[2]].color === "WHITE";
        else 
            return this.board[start[0]][start[2]].color === "WHITE" && this.board[end[0]][end[2]].color === "WHITE";
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

    movePiece(start, end, movingPiece){
 
        if(Math.abs(end[0] - start[0]) > 1){

            let coords = this.getDiagonalPiece(start, end);
            this.board[coords[0]][coords[1]] = null;
        }
        
        this.board[end[0]][end[2]].piece = movingPiece;
        this.board[start[0]][start[2]].piece = null
        movingPiece.isSelected = false;

        if(parseInt(end[0]) === 0 || parseInt(end[0]) === 7){

            if(movingPiece.status !== "KING"){
                movingPiece.makeKing();
            }
        }                     
    }

    noBackwardsMovement(movingPiece, start, end){

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
        this.jumpingPiece = null;
        this.resetSelected();
        return this.turn;
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

    handleDoubleClick(id){
        this.board.resetSelected();
    }

    switchTurn(){
        return this.board.switchTurn();
    }
}

module.exports = Checkers;