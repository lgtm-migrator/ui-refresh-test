import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../common/hooks';
import { login, logout, loginStatus } from './loginSlice';

export default function Login() {
  const loggedIn = useAppSelector(loginStatus);
  const user = useAppSelector((state) => state.login.user);
  return (
    <div>
      <h2>Login</h2>
      <p>
        {loggedIn ? `You are logged in as '${user}'` : `You are not logged in`}
      </p>
      {loggedIn ? <LogoutForm /> : <LoginForm />}
    </div>
  );
}

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>();
  const onLogin = () => {
    if (name) {
      dispatch(login(name));
    } else {
      alert('Please enter a username');
    }
  };
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

const LogoutForm = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};
