import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from '../common/Nav';
import Count from '../features/count/Counter';
import About from '../features/fixedPages/About';
import Home from '../features/fixedPages/Home';
import Login from '../features/login/Login';
import Users from '../features/fixedPages/Users';

export default function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/count">
            <Count />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
