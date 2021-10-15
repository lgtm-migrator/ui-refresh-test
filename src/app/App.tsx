import './App.scss';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppDispatch } from '../common/hooks';
import { useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { getCookie } from '../common/cookie';

import Nav from '../common/Nav';
import Count from '../features/count/Counter';
import About from '../features/fixedPages/About';
import Home from '../features/fixedPages/Home';
import Auth from '../features/auth/Auth';
import Users from '../features/fixedPages/Users';

export default function App() {
  const dispatch = useAppDispatch();

  // Pull token from cookie. If it exists, use it for auth.
  const token = getCookie('kbase_session');
  useEffect(() => {
    if (token) dispatch(authFromToken(token));
    // OK to ignore dispatch as dependency here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
