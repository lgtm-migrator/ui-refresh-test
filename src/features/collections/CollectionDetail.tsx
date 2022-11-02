import { useParams } from 'react-router-dom';
import { getCollection } from '../../common/api/collectionsApi';
import { usePageTitle } from '../layout/layoutSlice';
import { TaxaHistogram } from './data_products/TaxaHistogram';
import styles from './Collections.module.scss';
import { Card, CardList } from '../../common/components/Card';

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

        <p>Some text description of this collection</p>

        <ul>
          <li>
            Version:{' '}
            <strong>
              v{collection.version_num}: {collection.version_tag}
            </strong>
          </li>
        </ul>
      </div>
      <div className={styles['data_products']}>
        <CardList className={styles['data_product_list']}>
          <Card
            title="Data Product #1"
            subtitle="some further info"
            onClick={() => null}
          />
          <Card title="Data Product #2" onClick={() => null} />
          <Card title="Data Product #3" onClick={() => null} />
        </CardList>
        <div className={styles['data_product_detail']}>
          <TaxaHistogram data={{ product: 'TaxaHistogram' }} />
        </div>
      </div>
    </div>
  );
};
