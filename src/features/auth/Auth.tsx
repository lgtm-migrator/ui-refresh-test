import { useEffect, useState, useMemo } from 'react';
import {
  getUserProfile,
  setUserProfile,
} from '../../common/api/userProfileApi';
import { Button } from '../../common/components';
import { useAppSelector, usePageTitle } from '../../common/hooks';
import { getServiceClient } from '../../common/services';
import { authFromToken, revokeToken } from '../../common/api/authService';
import { faCheck, faX, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { parseError } from '../../common/api/utils/parseError';

export default function Auth() {
  usePageTitle('Authentication');
  const { username, token } = useAppSelector((state) => state.auth);
  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!token) return;
      const clientUserProfile = getServiceClient('UserProfile', token);
      const profile = await clientUserProfile.call('get_user_profile', [
        [username],
      ]);
      console.log({ profile }); // eslint-disable-line no-console
    })();
  }, [token, username]);
  // get the realname from the profile service
  return (
    <div>
      <p>
        {token ? `You are logged in as '${username}'` : `You are not logged in`}
      </p>
      {token ? <LogoutForm /> : <AuthForm />}
      <div>
        <UserRealNameChanger />
      </div>
    </div>
  );
}

const AuthForm = () => {
  const [tokenString, setTokenString] = useState<string>();
  const [authFromTokenQuery, authFromTokenResult] =
    authFromToken.useLazyQuery();

  const error = authFromTokenResult.isError
    ? parseError(authFromTokenResult.error).message
    : null;

  const handleLogin = () => {
    if (tokenString) {
      authFromTokenQuery(tokenString);
    } else {
      alert('Please enter a kbase token');
    }
  };

  return (
    <div>
      <input
        placeholder="kbase token"
        type="text"
        value={tokenString ?? ''}
        onChange={(e) => setTokenString(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
      {error ? (
        <>
          <br />
          <span style={{ color: 'red' }}>{error}</span>
        </>
      ) : null}
    </div>
  );
};

const LogoutForm = () => {
  const tokenId = useAppSelector(({ auth }) => auth.tokenInfo?.id);
  const [revokeTokenMutation, revokeTokenResult] = revokeToken.useMutation();

  const error = revokeTokenResult.isError
    ? parseError(revokeTokenResult.error).message
    : null;

  const handleLogout = () => {
    if (tokenId) revokeTokenMutation(tokenId);
  };

  return (
    <div>
      <Button onClick={handleLogout}>Logout of KBase</Button>
      {error ? (
        <>
          <br />
          <span style={{ color: 'red' }}>{error}</span>
        </>
      ) : null}
    </div>
  );
};

const UserRealNameChanger = () => {
  const username = useAppSelector((s) => s.auth.username);
  const profileParams = useMemo(
    () => ({ usernames: username ? [username] : [] }),
    [username]
  );
  const profile = getUserProfile.useQuery(profileParams, { skip: !username });
  const [updateProfile, updateProfileResult] = setUserProfile.useMutation();
  const [nameText, setNameText] = useState('');

  if (!username) return <></>;

  const changeName = async () => {
    const oldProfile = profile.data?.[0][0];
    const newProfile: typeof oldProfile = JSON.parse(
      JSON.stringify(profile.data?.[0][0])
    );
    if (newProfile === undefined) return;
    if (nameText.trim() === '') return;
    newProfile.user.realname = nameText.trim();
    updateProfile({ profile: newProfile });
  };

  //example for handling errors
  if (
    profile.error &&
    'status' in profile.error &&
    profile.error.status === 'JSONRPC_ERROR' &&
    // profile.error.data now contains the narrowly typed jsonRpc error response
    profile.error.data.error.message.includes('Something')
  ) {
    // handle jsonrpc errors
  } else {
    // handle other errors
  }

  return (
    <div style={{ maxWidth: '10em' }}>
      Profile:
      {profile.isSuccess ? (
        JSON.stringify(profile.data?.[0][0])
      ) : profile.isError ? (
        JSON.stringify(profile.error)
      ) : profile.isLoading ? (
        <FAIcon icon={faSpinner} spin />
      ) : (
        ' '
      )}
      <br />
      <input
        type="text"
        placeholder="Change Realname"
        value={nameText}
        onInput={(e) => setNameText(e.currentTarget.value)}
      />
      <button onClick={() => changeName()}>Update</button>
      {updateProfileResult.isLoading ? <FAIcon icon={faSpinner} spin /> : null}
      {updateProfileResult.isSuccess ? <FAIcon icon={faCheck} /> : null}
      {updateProfileResult.isError ? <FAIcon icon={faX} /> : null}
    </div>
  );
};
