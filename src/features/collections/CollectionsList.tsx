import { Link } from 'react-router-dom';
import { listCollections } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';
import styles from './Collections.module.scss';

export const CollectionsList = () => {
  usePageTitle('Data Collections');
  const collections = listCollections.useQuery();
  return (
    <ul className={styles['collection_list']}>
      {collections.isSuccess
        ? collections.data?.map((collection) => {
            return (
              <li className={styles['collection_list_item']}>
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
