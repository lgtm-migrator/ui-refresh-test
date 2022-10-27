import { useParams } from 'react-router-dom';
import { getCollection } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';
import styles from './Collections.module.scss';

export const CollectionDetail = () => {
  const { id } = useParams();
  const collectionQuery = getCollection.useQuery(id || '', {
    skip: id === undefined,
  });
  const collection = collectionQuery.data;
  usePageTitle(`Data Collections`);
  if (!collection) return <>loading...</>;
  return (
    <div className={styles['collection_wrapper']}>
      <div>
        <h1>
          {collection.name}
          <img
            src={collection.icon}
            alt={`${collection.name} collection icon`}
          />
        </h1>
      </div>
      <div>
        <h2>
          version number: {collection.version_num}
          <br />
          version name: {collection.version_tag}
        </h2>
      </div>
      <div></div>
    </div>
  );
};
