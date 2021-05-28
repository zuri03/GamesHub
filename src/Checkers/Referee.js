//start and end are the id of the start and destination of a piece Ex: start = '0,7'
const isValidMove = (start, end, diagPiece) => {

    console.log('Diag: ' + diagPiece);
    var endIndex = end.split(',');
    var startIndex = start.split(',');
    
    return diagPiece === null ?
        ((endIndex[0] % 2 === 0 && endIndex[1] % 2 === 0) || (endIndex[0] % 2 !== 0 && endIndex[1] % 2 !== 0)) &&  
            (Math.abs(startIndex[0] - endIndex[0]) === 1 && Math.abs(startIndex[1] - endIndex[1]) === 1) :
        ((Math.abs(endIndex[0] - startIndex[0]) === 2) && (Math.abs(endIndex[1] - startIndex[1])) === 2)
    
            
}

export default isValidMove;