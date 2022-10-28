import { useParams } from 'react-router-dom';
import { getCollection } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';
import { TaxaHistogram } from './data_products/TaxaHistogram';
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
      <div className={styles['collection_detail']}>
        <div className={styles['detail_header']}>
          <img
            src={collection.icon}
            alt={`${collection.name} collection icon`}
          />
          <span>{collection.name}</span>
        </div>
      </div>
      <div className={styles['collection_detail']}>
        <ul>
          <li>
            Version:{' '}
            <strong>
              v{collection.version_num}: {collection.version_tag}
            </strong>
          </li>
        </ul>
      </div>
      <div className={styles['collection_wrapper_row']}>
        <ul className={styles['collection_list']}>
          <li>Data Product #1</li>
          <li>Data Product #2</li>
          <li>Data Product #3</li>
        </ul>
        <div className={styles['collection_detail']}>
          <TaxaHistogram data={{ product: 'TaxaHistogram' }} />
        </div>
      </div>
    </div>
  );
};
