import { FC, ReactElement } from 'react';
import {
  Navigate,
  Route,
  Routes as RRRoutes,
  useLocation,
} from 'react-router-dom';

import Auth from '../features/auth/Auth';
import Count from '../features/count/Counter';
import Legacy from '../features/legacy/Legacy';
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
        element={<Authed element={<ProfileWrapper />} />}
      />
      <Route
        path="/profile/:usernameRequested"
        element={<Authed element={<ProfileWrapper />} />}
      />
      <Route
        path="/profile"
        element={<Authed element={<ProfileWrapper />} />}
      />
      <Route path="/count" element={<Authed element={<Count />} />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path={'/narratives/:id/:obj/:ver'}
        element={<Authed element={<Navigator />} />}
      />
      <Route
        path={'/narratives/:category'}
        element={<Authed element={<Navigator />} />}
      />
      <Route
        path={'/narratives/:category/:id/:obj/:ver'}
        element={<Navigator />}
      />
      <Route path="/narratives" element={<Authed element={<Navigator />} />} />
      <Route path="/" element={<HashRouteRedirect />} />
      <Route path="*" element={<PageNotFound />} />
    </RRRoutes>
  </>
);

const Authed: FC<{ element: ReactElement }> = ({ element }) => {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  if (!token)
    return (
      <Navigate
        to="/legacy/login"
        replace
        state={{ preLoginPath: location.pathname }}
      />
    );

  return <>{element}</>;
};

const HashRouteRedirect = () => {
  const location = useLocation();
  if (location.hash)
    return <Navigate to={`/legacy/${location.hash.slice(1)}`} replace />;
  return <Navigate to="/narratives" replace />;
};

export default Routes;
