/* eslint-disable */
import { usePageTitle, useAppSelector } from '../../common/hooks';
import { useParams, useLocation } from 'react-router-dom';
import NarrativeList from '../../common/components/NarrativeList/NarrativeList';
import { useEffect, useState, useMemo } from 'react';
import { NarrativeListDoc } from '../../common/models/NarrativeDoc';
import searchNarratives, { SearchResults } from '../../common/utils/searchNarratives';
import { getServiceClient } from '../../common/services';
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
  const { token, username } = useAppSelector(state => state.auth);

  const [itemsRemaining, setItemsRemaining] = useState<number>(0);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(false);
  const [items, setItems] = useState<NarrativeListDoc[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    searchNarratives({
      term: query.get('searchTerm') as string,
      sort: query.get('sort') as string,
      category: query.get('category') as string || 'own',
      pageSize: +(query.get('limit') as string || PAGE_SIZE)
    }, {}, username as string, token as string)
      .then((results: SearchResults) => {
        setItems(results.hits);
      });
  }, [category]);

  return (
    <section>
      category: {category}
      id: {id}
      obj: {obj}
      ver: {ver}
      <NarrativeList
        showVersionDropdown={!category}
        items={items}
        itemsRemaining={itemsRemaining}
        hasMoreItems={hasMoreItems}
        selectedIdx={selectedIdx}
        loading={loading}
      />
    </section>
  );
}
