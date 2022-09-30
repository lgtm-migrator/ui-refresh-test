import classes from './App.module.scss';

import { BrowserRouter as Router } from 'react-router-dom';
import { useAppDispatch } from '../common/hooks';
import { FC, useEffect } from 'react';
import { authFromToken } from '../features/auth/authSlice';
import { setEnvironment } from '../features/layout/layoutSlice';
import { getCookie } from '../common/cookie';
import { ErrorBoundary } from 'react-error-boundary';

import Routes from './Routes';
import LeftNavBar from '../features/layout/LeftNavBar';
import TopBar from '../features/layout/TopBar';
import ErrorPage from '../features/layout/ErrorPage';
const UnauthenticatedView: FC = () => (
  <>
    Set your <var>kbase_session</var> cookie to your login token.
  </>
);

export default function App() {
  const dispatch = useAppDispatch();

  // Pull token from cookie. If it exists, use it for auth.
  const token = getCookie('kbase_session');
  useEffect(() => {
    if (token) dispatch(authFromToken(token));
  }, [dispatch, token]);

  // Placeholder code for determining environment.
  useEffect(() => {
    dispatch(setEnvironment('ci'));
  }, [dispatch]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className={classes.container}>
        <div className={classes.topbar}>
          <TopBar />
        </div>
        <div className={classes.site_content}>
          <div className={classes.left_navbar}>
            <LeftNavBar />
          </div>
          <div className={classes.page_content}>
            <ErrorBoundary FallbackComponent={ErrorPage}>
              {token ? <Routes /> : <UnauthenticatedView />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </Router>
  );
}
