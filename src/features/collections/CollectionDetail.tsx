import { useParams } from 'react-router-dom';
import { getCollection } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';

export const CollectionDetail = () => {
  const { id } = useParams();
  const collection = getCollection.useQuery(id || '', {
    skip: id === undefined,
  });
  const name = collection.data?.name;
  usePageTitle(`Collections > ${name || 'Loading'}`);
  return <>{JSON.stringify(collection.data)}</>;
};
