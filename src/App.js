import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Checkers from './Checkers.js';

const img = "https://www.seekpng.com/png/detail/232-2328978_icon-checkers-icon.png"
function App() {
  return (
    <div className="App">
      <header className="App-header"> GamesHub! 
      </header>
      <body className="App-body">
        <Router>
          <Switch>
          <Route path="/Checkers">
            <Checkers />
          </Route>
          </Switch>
        </Router>
      </body>
    </div>
    /*
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
  );
}

export default App;
