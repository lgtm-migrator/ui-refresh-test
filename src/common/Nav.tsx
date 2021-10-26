import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <FA icon={faHome} />
            Home
          </Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/count">Count</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/auth">Auth</Link>
        </li>
      </ul>
    </nav>
  );
}
