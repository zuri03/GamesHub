//start and end are the id of the start and destination of a piece Ex: start = '0,7'
const validateMove = (start, end) => {
    var endIndex = end.split(',');
    var startIndex = start.split(',');

    //Because of the checkered pattern on the board this will determine of the endspace is a white space 
    if((endIndex[0] % 2 === 0 && endIndex[1] % 2 === 0) || (endIndex[0] % 2 !== 0 && endIndex[1] % 2 !== 0)){
            
        //Make sure player only moves vertically or horizontally one space
        if(Math.abs(startIndex[0] - endIndex[0]) === 1 && Math.abs(startIndex[1] - endIndex[1]) === 1){
            return true;
        }
        return false;     
    } 
    return false;    
}

export default validateMove;