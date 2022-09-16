import { Link } from 'react-router-dom';
import { Route, Routes, useParams } from 'react-router-dom';
import {
  useGetCollectionQuery,
  useListCollectionsQuery,
} from '../../common/api/collectionsApi';
import { usePageTitle } from '../../common/hooks';

export default function Collections() {
  return (
    <Routes>
      <Route path="/" element={<CollectionsList />} />
      <Route path=":doi" element={<CollectionDetail />} />
      <Route path="*" element={<span>hmmm</span>} />
    </Routes>
  );
}

const CollectionDetail = () => {
  const { doi } = useParams();
  const collection = useGetCollectionQuery(
    { collection_id: doi as string },
    { skip: doi === undefined }
  );
  const name = collection.data?.[0]?.name;
  usePageTitle(`Collections > ${name || 'Loading'}`);
  return <>{JSON.stringify(collection.data)}</>;
};

const CollectionsList = () => {
  usePageTitle('Collections');
  const collections = useListCollectionsQuery();
  return (
    <ul>
      {collections.isSuccess
        ? collections.data?.[0].map((collection) => {
            return (
              <li>
                <img
                  src={collection.icon}
                  alt={`${collection.name} collection icon`}
                />
                <Link to={encodeURIComponent(collection.doi)}>
                  <h4>{collection.name}</h4>
                </Link>
                <span>{collection.description}</span>
              </li>
            );
          })
        : null}
    </ul>
  );
};
