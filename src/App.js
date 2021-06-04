import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Checkers from './Checkers/Checkers.js';
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
        <Router>
          <Switch> 
            <Route path="/">
            <header className="App-header"> GamesHub! </header>
            </Route>    
            <Route path="/Checkers">
              <Checkers />
            </Route>
          </Switch>
        </Router>
    </div>
      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      */
    )
  }
}

export default App;
