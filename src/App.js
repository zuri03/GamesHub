import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import Checkers from './Checkers/Checkers.js';
import WordSolver from './WordSolver/WordSolver.js';
import Home from './Home/Home.js';
import React from "react";

const img = "https://www.seekpng.com/png/detail/232-2328978_icon-checkers-icon.png";

function App (props){
  return (
    <div className="App">
      <header className="App-header"> GamesHub!
      <button 
          className="Home-button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href='http://localhost:3000/';
          }} 
          type="button">
          Home
      </button> 
      </header>
      <body className="App-body">
      <Router>
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/Checkers">
            <Checkers />
          </Route>
          <Route path="/WordSolver">
            <WordSolver />
          </Route>
          </Switch>
      </Router>
      </body>
    </div>
  )
}

export default App;
