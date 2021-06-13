import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import Checkers from './Checkers/Checkers.js';
import WordSolver from './WordSolver/WordSolver.js';
import Home from './Home.js';
import React from "react";

const img = "https://www.seekpng.com/png/detail/232-2328978_icon-checkers-icon.png";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mess: "check"
    }
    this.changeButton = this.changeButton.bind(this)
  }
  changeButton(){
    this.setState({mess: "New"})
  }
  render(){
    
    return (
      <div className="App">
        <header className="App-header"> GamesHub! 
        </header>
        <body className="App-body">
        </body>
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
        <footer className="App-footer">
          <button 
            onClick={(e) => {
              e.preventDefault();
              window.location.href='http://localhost:3000/';
            }} 
            type="button">
            Home!
          </button>
        </footer>
      </div>
      /*
      <div className="App">
        <header className="App-header"> GamesHub! 
        </header>
          <Router>
            <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/Checkers">
              <Checkers />
            </Route>
            </Switch>
          </Router>
  
        <body className="App-body"></body>
        <footer className="App-footer">
          <button 
            onClick={(e) => {
              e.preventDefault();
              window.location.href='http://localhost:3000/';
            }} 
            type="button">
            Home!
          </button>
        </footer>
      </div>
      */
    )
  }
}

export default App;
