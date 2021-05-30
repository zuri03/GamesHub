

const turn = {
    currentTurn: "RED",
    switchTurn() {
        this.currentTurn === "RED"?
            this.currentTurn = "WHITE":
            this.currentTurn = "RED"
    }
}

function isValidMove(start, end, diagPiece) {

    var endIndex = end.split(',');
    var startIndex = start.split(',');
    
    return diagPiece === null ?
        ((endIndex[0] % 2 === 0 && endIndex[1] % 2 === 0) || (endIndex[0] % 2 !== 0 && endIndex[1] % 2 !== 0)) &&  
            (Math.abs(startIndex[0] - endIndex[0]) === 1 && Math.abs(startIndex[1] - endIndex[1]) === 1) :
        ((Math.abs(endIndex[0] - startIndex[0]) === 2) && (Math.abs(endIndex[1] - startIndex[1])) === 2) &&
            (diagPiece.props.pieceColor !== turn.currentTurn);  
            
}


export default isValidMove;

