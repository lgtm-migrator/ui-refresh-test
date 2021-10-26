import { Link, useLocation } from 'react-router-dom';
import classes from './LeftNavBar.module.scss';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamation,
  faCompass,
  faUsers,
  faBook,
  faSearch,
  faSuitcase,
  faIdCard,
  faBullhorn,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

const navItems: [string, string, IconDefinition][] = [
  // [path, desc, icon]
  ['/', 'Navigator', faCompass],
  ['/orgs', 'Orgs', faUsers],
  ['/catalog', 'Catalog', faBook],
  ['/search', 'Search', faSearch],
  ['/jobs', 'Jobs', faSuitcase],
  ['/account', 'Account', faIdCard],
  ['/feeds', 'Feeds', faBullhorn],
  ['/count', 'Count', faExclamation],
  ['/auth', 'Auth', faExclamation],
];

export default function Nav() {
  const location = useLocation();
  return (
    <nav>
      <ul className={classes.nav_list}>
        {navItems.map(([path, desc, icon]) => {
          let itemClasses = classes.nav_item;
          if (location.pathname === path) {
            itemClasses += ` ${classes.active}`;
          }
          return (
            <li className={itemClasses} key={path}>
              <Link to={path}>
                <FAIcon className={classes.nav_icon} icon={icon} />
                <span className={classes.nav_desc}>{desc}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
