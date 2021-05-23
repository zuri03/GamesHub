import React, {Component} from 'react';

function Space(props) {
    return (
        <button className={props.spaceColor}>{props.index}</button>   
    );
}
class Checkers extends React.Component {

    constructor(props){
        super(props);
        const rows = Array(8).fill(null);
        this.state = {
            spaces : Array(8).fill(null).map(() => rows.slice())
        };
        
        var color;
        for(var i = 0; i < this.state.spaces.length; i++){
            color = (i % 2) === 0 ? 1 : 0;
            for(var j = 0; j < this.state.spaces.length; j++){
                if(color === 0){
                    this.state.spaces[i][j] = <Space spaceColor="Checkers-whiteSpace" index={i} />
                    color++;
                } else if (color === 1){
                    this.state.spaces[i][j] = <Space spaceColor="Checkers-blackSpace" index={i} />
                    color--;
                } else {
                    console.log("Error color = " + color)
                }
            }
        }
    }

    render() {
        return (
            <div className="Checkers-Board">
                <div className="Checkers-row">
                    {this.state.spaces[0]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[1]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[2]}
                </div>
                <div className="Checkers-row">
                    {this.state.spaces[3]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[4]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[5]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[6]}
                </div>
                <div className="Checkers-Row">
                    {this.state.spaces[7]}
                </div>
            </div>
        );
    }
}

export default Checkers;