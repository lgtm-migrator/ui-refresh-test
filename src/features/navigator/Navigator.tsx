import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Button, Input, InputInterface, Select } from '../../common/components';
import { PlaceholderFactory } from '../../common/components/PlaceholderFactory';
import { NarrativeListDoc } from '../../common/types/NarrativeDoc';
import { usePageTitle } from '../../features/layout/layoutSlice';
import NarrativeList from './NarrativeList/NarrativeList';
// FAKE DATA
import { testItems } from './NarrativeList/NarrativeList.fixture';
import { keepParamsForLocation } from './common';
import classes from './Navigator.module.scss';

const searchParams = ['sort', 'search'];

const sorts: Record<string, string> = {
  '-updated': 'Recently updated',
  updated: 'Least recently updated',
  '-created': 'Recently created',
  created: 'Oldest',
  lex: 'Lexicographic (A-Za-z)',
  '-lex': 'Reverse Lexicographic',
};

const NarrativeNewButton: FC = () => (
  <a href="/#narrativemanager/new" rel="noopener noreferrer" target="_blank">
    <Button className={`${classes.button} ${classes['narrative-new']}`}>
      <FAIcon icon={faPlus} /> New Narrative
    </Button>
  </a>
);
/* NarrativeView should take (at least) a narrative upa as prop, but if it is
   null then it should show a message saying there is no narrative selected.
*/
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
const FilterContainer: FC<{ search: string; sort: string }> = ({
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
const HeaderTabs: FC<{ category: string }> = ({ category }) => {
  const loc = useLocation();
  const keepSearch = keepParamsForLocation({
    location: loc,
    params: searchParams,
  });
  return (
    <ul className={classes.tabs}>
      <Link to={keepSearch('/narratives/')}>
        <li className={category === 'own' ? classes.active : ''}>
          My Narratives
        </li>
      </Link>
      <Link to={keepSearch('/narratives/shared/')}>
        <li className={category === 'shared' ? classes.active : ''}>
          Shared With Me
        </li>
      </Link>
      <Link to={keepSearch('/narratives/tutorials/')}>
        <li className={category === 'tutorials' ? classes.active : ''}>
          Tutorials
        </li>
      </Link>
      <Link to={keepSearch('/narratives/public/')}>
        <li className={category === 'public' ? classes.active : ''}>Public</li>
      </Link>
    </ul>
  );
};

const HeaderNavigationContainer: FC<{ category: string }> = ({ category }) => (
  <nav className={classes.header}>
    <HeaderTabs category={category} />
    <NarrativeNewButton />
  </nav>
);

const HeaderContainer: FC<{ category: string; search: string; sort: string }> =
  ({ category, search, sort }) => (
    <header className={classes.header}>
      <HeaderNavigationContainer category={category} />
      <FilterContainer search={search} sort={sort} />
    </header>
  );

const MainContainer: FC<{
  items: NarrativeListDoc[];
  narrative: string | null;
  view: string;
}> = ({ items, narrative, view }) => {
  return (
    <div className={classes.main} /* main fragment */>
      <div className={classes.container}>
        <div className={classes.list}>
          <NarrativeList
            hasMoreItems={true}
            items={items}
            itemsRemaining={40}
            loading={false}
            narrative={narrative}
            showVersionDropdown={true}
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
  /*
  The default selected narrative should be the 0 indexed item in items.
  If the length of items is 0 then a message should be shown.
  If the URL specifies a valid narrative object then it should be selected,
  otherwise the default should be selected.
  */
  const { access_group, obj_id, version } = testItems[0];
  const upa = `${access_group}/${obj_id}/${version}`;
  const narrativeSelected = id && obj && ver ? `${id}/${obj}/${ver}` : upa;
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
        <HeaderContainer
          category={categoryFilter}
          search={search}
          sort={sort}
        />
        <MainContainer
          items={testItems}
          narrative={narrativeSelected}
          view={view}
        />
      </section>
    </>
  );
};

export default Navigator;
