import { FC } from 'react';
import { useAppSelector } from '../../common/hooks';
import classes from './TopBar.module.scss';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faEnvelope,
  faFile,
  faFlask,
  faIdCard,
  faInfo,
  faPlus,
  faQuestion,
  faQuestionCircle,
  faSearch,
  faServer,
  faSignOutAlt,
  faSortDown,
  faSquare,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../common/components';
import { useHistory } from 'react-router-dom';

import logo from '../../common/assets/logo/46_square.png';

export default function TopBar() {
  return (
    <header className={classes.topbar}>
      <div className={classes.topbar_item}>
        <HamburgerMenu />
      </div>
      <div className={classes.topbar_item}>
        <img src={logo} alt="" />
      </div>
      <div className={[classes.topbar_item, classes.stretch].join(' ')}>
        <PageTitle />
      </div>
      <div className={classes.topbar_item}>
        <Enviroment />
      </div>
      <div className={classes.topbar_item}>
        <LoginMenu />
      </div>
    </header>
  );
}

const LoginMenu: FC = () => {
  const history = useHistory();
  return (
    <div className={classes.login_menu}>
      <Dropdown
        horizontalMenuAlign="right"
        options={[
          {
            options: [
              {
                value: '',
                icon: undefined,
                label: (
                  <div>
                    <div>First Last</div>
                    <div className={classes.login_menu_username}>username</div>
                  </div>
                ),
              },
            ],
          },
          {
            options: [
              {
                value: '#your_profile',
                icon: <FAIcon icon={faUser} />,
                label: 'Your Profile',
              },
              {
                value: '#your_account',
                icon: <FAIcon icon={faIdCard} />,
                label: 'Your Account',
              },
            ],
          },
          {
            options: [
              {
                value: '#sign_out',
                icon: <FAIcon icon={faSignOutAlt} />,
                label: 'Sign Out',
              },
            ],
          },
        ]}
        onChange={(opt) => {
          if (opt && 'value' in opt) {
            history.push(opt?.value);
          }
        }}
      >
        <div className={classes.login_menu_button}>
          <FAIcon className={classes.login_menu_icon} icon={faSquare} />
          <FAIcon icon={faSortDown} />
        </div>
      </Dropdown>
    </div>
  );
};

const HamburgerMenu: FC = () => {
  const history = useHistory();
  return (
    <div className={classes.hamburger_menu}>
      <Dropdown
        options={[
          {
            options: [
              {
                value: '#narrative_interface',
                icon: <FAIcon icon={faFile} />,
                label: 'Narrative Interface',
              },
              {
                value: '#new_narrative',
                icon: <FAIcon icon={faPlus} />,
                label: 'New Narrative',
              },
              {
                value: '#jgi_search',
                icon: <FAIcon icon={faSearch} />,
                label: 'JGI Search',
              },
              {
                value: '#biochem_search',
                icon: <FAIcon icon={faSearch} />,
                label: 'Biochem Search',
              },
            ],
          },
          {
            options: [
              {
                value: '#kbase_services_status',
                icon: <FAIcon icon={faServer} />,
                label: 'KBase Services Status',
              },
            ],
          },
          {
            options: [
              {
                value: '#about',
                icon: <FAIcon icon={faInfo} />,
                label: 'About',
              },
              {
                value: '#contact_kbase',
                icon: <FAIcon icon={faEnvelope} />,
                label: 'Contact KBase',
              },
              {
                value: '#support',
                icon: <FAIcon icon={faQuestion} />,
                label: 'Support',
              },
            ],
          },
        ]}
        onChange={(opt) => {
          if (opt && 'value' in opt) {
            history.push(opt?.value);
          }
        }}
      >
        <FAIcon className={classes.hamburger_menu_icon} icon={faBars} />
      </Dropdown>
    </div>
  );
};

const PageTitle: FC = () => {
  const title = useAppSelector((state) => state.layout.pageTitle);
  return (
    <div className={classes.page_title}>
      <span>{title || ''}</span>
    </div>
  );
};

const Enviroment: FC = () => {
  const env = useAppSelector((state) => state.layout.environment);
  if (env === 'production') return null;
  const icon = {
    ci: faFlask,
    unknown: faQuestionCircle,
    appdev: faWrench,
  }[env];
  const txt = {
    ci: 'CI',
    unknown: '??',
    appdev: 'APPDEV',
  }[env];
  return (
    <div className={classes.environment}>
      <span>{txt}</span>
      <FAIcon icon={icon} />
    </div>
  );
};
