import { Link } from 'react-router-dom';
import { Route, Routes, useParams } from 'react-router-dom';
import {
  getCollection,
  listCollections,
} from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';

export default function Collections() {
  return (
    <Routes>
      <Route path="/" element={<CollectionsList />} />
      <Route path="/:id" element={<CollectionDetail />} />
      <Route path="*" element={<span>hmmm</span>} />
    </Routes>
  );
}

const CollectionDetail = () => {
  const { id } = useParams();
  const collection = getCollection.useQuery(id || '', {
    skip: id === undefined,
  });
  const name = collection.data?.name;
  usePageTitle(`Collections > ${name || 'Loading'}`);
  return <>{JSON.stringify(collection.data)}</>;
};

const CollectionsList = () => {
  usePageTitle('Collections');
  const collections = listCollections.useQuery();
  return (
    <ul>
      {collections.isSuccess
        ? collections.data?.map((collection) => {
            return (
              <li>
                <img
                  src={collection.icon}
                  alt={`${collection.name}l collection icon`}
                />
                <Link to={encodeURIComponent(collection.id)}>
                  <h4>{collection.name}</h4>
                </Link>
                <span>{collection.source_version}</span>
              </li>
            );
          })
        : null}
    </ul>
  );
};
