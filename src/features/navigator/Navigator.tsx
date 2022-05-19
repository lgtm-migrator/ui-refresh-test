/* eslint-disable */
import { usePageTitle, useAppSelector } from '../../common/hooks';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import NarrativeList from '../../common/components/NarrativeList/NarrativeList';
import { useEffect, useState, useMemo, useRef } from 'react';
import { NarrativeListDoc } from '../../common/models/NarrativeDoc';
import searchNarratives, { SearchResults } from '../../common/utils/searchNarratives';
interface ParamTypes {
  category: string;
  id: string;
  obj: string;
  ver: string;
}

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Navigator() {
  usePageTitle('Narrative Navigator');
  const PAGE_SIZE = 20;
  const { category, id, obj, ver } = useParams<ParamTypes>();
  const query = useQuery();
  const history = useHistory();
  const { token, username } = useAppSelector(state => state.auth);
  const itemsRemaining = useRef(0);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(false);
  const [items, setItems] = useState<NarrativeListDoc[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { getNarratives(); }, [category]);

  async function getNarratives(append = false) {
    setLoading(true);
    const resp = await searchNarratives({
      term: query.get('searchTerm') || '',
      sort: query.get('sort') as string,
      category: query.get('category') || 'own',
      pageSize: +(query.get('limit') || PAGE_SIZE),
      skip: append ? items.length : undefined // TODO: I *really* hate this line
    }, {}, username, token)
    if (append) {
      itemsRemaining.current = resp.count - (resp.hits.length + items.length);
      setItems([...items, ...resp.hits]);
    } else {
      itemsRemaining.current = resp.count - resp.hits.length;
      setItems(resp.hits);
    }
    setHasMoreItems(itemsRemaining.current > 0);
    setLoading(false);
  }

  return (
    <section>
      category: {category}
      id: {id}
      obj: {obj}
      ver: {ver}
      <pre>ITEMS REMAINING: {itemsRemaining.current} </pre>
      <NarrativeList
        onSelectItem={upa => history.push(`/narratives/${upa}`)}
        onLoadMoreItems={() => getNarratives(true)}
        itemsRemaining={itemsRemaining.current}
        showVersionDropdown={!category}
        hasMoreItems={hasMoreItems}
        selectedIdx={selectedIdx}
        loading={loading}
        items={items}
      />
    </section>
  );
}
