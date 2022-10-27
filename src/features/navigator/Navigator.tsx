import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, InputInterface, Select } from '../../common/components';
import { PlaceholderFactory } from '../../common/components/PlaceholderFactory';
import NarrativeList from '../../common/components/NarrativeList/NarrativeList';
// FAKE DATA
import { testItems } from '../../common/components/NarrativeList/NarrativeList.fixture';
import { usePageTitle } from '../../features/layout/layoutSlice';
import { NarrativeListDoc } from '../../common/types/NarrativeDoc';
import classes from './Navigator.module.scss';

const sorts: Record<string, string> = {
  '-updated': 'Recently updated',
  updated: 'Least recently updated',
  '-created': 'Recently created',
  created: 'Oldest',
  lex: 'Lexicographic (A-Za-z)',
  '-lex': 'Reverse Lexicographic',
};

// eslint-disable-next-line no-restricted-globals
const loc = location;

// Take a pathname (relative or absolute) and create a url to that pathname
// preserving the current query parameters
const keepParams = (params: string[], link: string) => {
  // Is the link relative or absolute?
  const linkAbsolute = link[0] === '/';
  // An extra slash is needed eventually if the path is relative.
  const extraSlash = linkAbsolute ? '' : '/';
  // The PUBLIC_URL prefix should be removed from relative links.
  const publicPrefix = process.env.PUBLIC_URL;
  // If the link is absolute then use it for the new pathmame,
  // otherwise use the current path without the publicPrefix.
  const pathnamePrefix = linkAbsolute
    ? ''
    : loc.pathname.slice(publicPrefix.length);
  // Create a new URL object with the appropriate href.
  const newLinkHref = loc.origin + pathnamePrefix + extraSlash + link;
  const newLink = new URL(newLinkHref);
  // Remember the desired SearchParams.
  const locSearchParams = new URLSearchParams(loc.search);
  params.forEach((param) => {
    const value = locSearchParams.get(param);
    if (value !== null) {
      newLink.searchParams.set(param, value);
    }
  });
  return newLink.pathname + newLink.search;
};

const keepSort = (link: string) => keepParams(['sort', 'search'], link);

const NarrativeNewButton: FC = () => (
  <a href="/#narrativemanager/new" rel="noopener noreferrer" target="_blank">
    <Button className={`${classes.button} ${classes['narrative-new']}`}>
      <FAIcon icon={faPlus} /> New Narrative
    </Button>
  </a>
);
const NarrativeView = PlaceholderFactory('NarrativeView');
interface SearchInterface extends InputInterface {
  search: string;
}
const SearchInput: FC<SearchInterface> = ({
  label,
  search,
}: SearchInterface) => (
  <Input label={label} placeholder=":mag:" defaultValue={search} />
);

const SortSelect: FC<{ sort: string }> = ({ sort }) => {
  const options = Object.entries(sorts).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  return <Select className={classes.sort} options={options} />;
};
const RefreshButton: FC = () => (
  <Button className={`${classes.button} ${classes['refresh']}`}>
    Refresh <FAIcon icon={faRefresh} />
  </Button>
);
const FilterFragment: FC<{ search: string; sort: string }> = ({
  search,
  sort,
}) => {
  return (
    <div className={classes.search}>
      <SearchInput label={<></>} search={search} />
      <SortSelect sort={sort} />
      <RefreshButton />
    </div>
  );
};
const HeaderTabs: FC<{ category: string }> = ({ category }) => (
  <ul className={classes.tabs}>
    <NavLink to={keepSort('/narratives/')}>
      <li>My Narratives</li>
    </NavLink>
    <NavLink to={keepSort('/narratives/shared/')}>
      <li>Shared With Me</li>
    </NavLink>
    <NavLink to={keepSort('/narratives/tutorials/')}>
      <li>Tutorials</li>
    </NavLink>
    <NavLink to={keepSort('/narratives/public/')}>
      <li>Public</li>
    </NavLink>
  </ul>
);

const HeaderNavigationFragment: FC<{ category: string }> = ({ category }) => (
  <nav className={classes.header}>
    <HeaderTabs category={category} />
    <NarrativeNewButton />
  </nav>
);

const HeaderFragment: FC<{ category: string; search: string; sort: string }> =
  ({ category, search, sort }) => (
    <header className={classes.header}>
      <HeaderNavigationFragment category={category} />
      <FilterFragment search={search} sort={sort} />
    </header>
  );

const MainFragment: FC<{
  items: NarrativeListDoc[];
  narrative: string | null;
  view: string;
}> = ({ items, narrative, view }) => {
  return (
    <div className={classes.main} /* main fragment */>
      <div className={classes.container}>
        <div className={classes.list}>
          <NarrativeList
            items={items}
            showVersionDropdown={true}
            itemsRemaining={40}
            hasMoreItems={true}
            loading={false}
          />
        </div>
        <NarrativeView
          className={classes.details}
          narrative={narrative}
          view={view}
        />
      </div>
    </div>
  );
};

// Navigator component
const Navigator: FC = () => {
  usePageTitle('Narrative Navigator');
  const { category, id, obj, ver } =
    useParams<{ category: string; id: string; obj: string; ver: string }>();
  // we will set params eventually
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'data';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-updated';
  const categoryFilter = category ? category : 'own';
  const narrativeSelected = id ? `${id}/${obj}/${ver}` : null;
  const envs = Object.entries(process.env);
  return (
    <>
      <h2>Navigator goes here</h2>
      <pre>{`
        category: ${category}
        id: ${id}
        obj: ${obj}
        search: ${search}
        sort: ${sort}
        ver: ${ver}
        view: ${view}
        categoryFilter: ${categoryFilter}
        narrativeSelected: ${narrativeSelected}
        Environment variables:
          ${envs.map((env) => env.join('=')).join('\n          ')}
      `}</pre>
      <section className={classes.navigator}>
        <HeaderFragment category={categoryFilter} search={search} sort={sort} />
        <MainFragment
          items={testItems}
          narrative={narrativeSelected}
          view={view}
        />
      </section>
    </>
  );
};

export default Navigator;
