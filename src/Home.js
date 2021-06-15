import React from 'react';

function Home(props){
    return(
        <div className="Container">
                <div className="Checkers-link">CHECKERS!</div>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='http://localhost:3000/Checkers';
                    }} 
                    type="button">
                    Checkers!
                </button>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='http://localhost:3000/WordSolver';
                    }} 
                    type="button">
                    Word Solver!
                </button>
        </div>
    );
}

export default Home;