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
        </div>
    );
    /*
    return(
        <div className="Container">
            <div className="Checkers-link">
                <div className="Checkers-desc">
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href='http://localhost:3000/Checkers';
                    }} 
                    type="button">
                    Checkers!
                </button>
                </div>
            </div>
        </div>
    )
    */
}

export default Home;