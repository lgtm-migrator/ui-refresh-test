import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './store';

test('renders login page link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});

test('login page link works', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Login/i);
  linkElement.click();
  const LoginStatusText = screen.getByText(/You are not logged in/i);
  expect(LoginStatusText).toBeInTheDocument();
});
