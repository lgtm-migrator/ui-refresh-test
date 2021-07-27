import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import Nav from './components/Nav';
import About from './components/pages/About';
import Home from './components/pages/Home';
import Users from './components/pages/Users';

export default function App() {
  return (
    <Router>
      <div>
        <Nav></Nav>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
