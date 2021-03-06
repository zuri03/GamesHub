import React from 'react';
import './Home.css'

const Home = () => {

    return(
        <div className="Container">
            <div className="Checkers-link">
                <img 
                    src="https://d29fhpw069ctt2.cloudfront.net/clipart/115975/preview/1322756040_preview_a19d.png"
                    width="527px"
                    height="190px"
                />  
                <h1>Checkers!</h1>
                <p>
                    Play Checkers against your friend!
                    <br/>
                    Jump your opponent's pieces until there are none left
                    <br/>
                    This is a simple checkers game built using react and css
                    <br/>
                    AI player coming soon!
                    <br/>
                    Tools: React, HTML, Javascript, CSS, Node.js, Express.js
                </p> 
                <button className="gameLink"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='http://localhost:3000/Checkers';
                    }} 
                    type="button">
                    PLAY
                </button>
            </div>
            <div className="WordSolver-link">
                <img
                    src="https://words-solver.com/wp-content/uploads/2020/09/words-solver-1200x1630-1.png"
                    width="527px"
                    height="190px"
                />
                <h1>Word Solver!</h1>
                <p>
                    Make words out of randomly selected letters
                    <br/>
                    Submitting multiple words in a row gives you additional points
                    <br/>
                    Submitting a wrong word will subtract points
                    <br/>
                    Built using meriam dictionary API
                    <br/>
                    Tools: React, HTML, Javascript, CSS, Node.js
                </p> 
                <button className="gameLink"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='http://localhost:3000/WordSolver';
                    }} 
                    type="button">
                    PLAY
                </button>
            </div>
        </div>
    )
}

export default Home;