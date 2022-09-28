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

const Routes: FC = () => (
  <>
    <RRRoutes>
      <Route path="/legacy/*" element={<Legacy />} />
      <Route
        path="/profile/:usernameRequested/narratives"
        element={<ProfileWrapper />}
      />
      <Route path="/profile/:usernameRequested" element={<ProfileWrapper />} />
      <Route path="/profile" element={<ProfileWrapper />} />
      <Route path="/count" element={<Count />} />
      <Route path="/auth" element={<Auth />} />
      <Route path={'/narratives/:id/:obj/:ver'} element={<Navigator />} />
      <Route path={'/narratives/:category'} element={<Navigator />} />
      <Route
        path={'/narratives/:category/:id/:obj/:ver'}
        element={<Navigator />}
      />
      <Route path="/narratives" element={<Navigator />} />
      <Route path="/" element={<HashRouteRedirect />} />
      <Route path="*" element={<PageNotFound />} />
    </RRRoutes>
  </>
);

const HashRouteRedirect = () => {
  const location = useLocation();
  if (location.hash)
    return <Navigate to={`/legacy/${location.hash.slice(1)}`} replace />;
  return <Navigate to="/narratives" replace />;
};

export default Routes;
