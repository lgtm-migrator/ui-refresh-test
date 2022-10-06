import { FC } from 'react';
import {
  Navigate,
  Route,
  Routes as RRRoutes,
  useLocation,
} from 'react-router-dom';

import Auth from '../features/auth/Auth';
import Count from '../features/count/Counter';
import Legacy from '../features/legacy/LegacyNew';
import Navigator from '../features/navigator/Navigator';
import PageNotFound from '../features/layout/PageNotFound';
import ProfileWrapper from '../features/profile/Profile';
import { useAppSelector } from '../common/hooks';

const Routes: FC = () => (
  <>
    <RRRoutes>
      <Route path="/legacy/*" element={<Legacy />} />
      <Route
        path="/profile/:usernameRequested/narratives"
        element={
          <Authed>
            <ProfileWrapper />
          </Authed>
        }
      />
      <Route
        path="/profile/:usernameRequested"
        element={
          <Authed>
            <ProfileWrapper />
          </Authed>
        }
      />
      <Route
        path="/profile"
        element={
          <Authed>
            <ProfileWrapper />
          </Authed>
        }
      />
      <Route
        path="/count"
        element={
          <Authed>
            <Count />
          </Authed>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route
        path={'/narratives/:id/:obj/:ver'}
        element={
          <Authed>
            <Navigator />
          </Authed>
        }
      />
      <Route
        path={'/narratives/:category'}
        element={
          <Authed>
            <Navigator />
          </Authed>
        }
      />
      <Route
        path={'/narratives/:category/:id/:obj/:ver'}
        element={<Navigator />}
      />
      <Route
        path="/narratives"
        element={
          <Authed>
            <Navigator />
          </Authed>
        }
      />
      <Route path="/unauth" element={<UnauthenticatedView />} />
      <Route path="/" element={<HashRouteRedirect />} />
      <Route path="*" element={<PageNotFound />} />
    </RRRoutes>
  </>
);

const UnauthenticatedView = () => {
  const { state } = useLocation();
  const path: string | undefined =
    state &&
    typeof state == 'object' &&
    'path' in state &&
    typeof (state as { path: unknown }).path == 'string'
      ? ((state as { path: string }).path as string)
      : undefined;
  return (
    <>
      Route <code>{path}</code> requires auth. Set your <var>kbase_session</var>{' '}
      cookie to your login token.
    </>
  );
};

const Authed: FC = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  if (!token)
    return (
      <Navigate to="/unauth" replace state={{ path: location.pathname }} />
    );

  return <>{children}</>;
};

const HashRouteRedirect = () => {
  const location = useLocation();
  if (location.hash)
    return <Navigate to={`/legacy/${location.hash.slice(1)}`} replace />;
  return <Navigate to="/narratives" replace />;
};

export default Routes;
