import { FC } from 'react';
import { DataProduct as DataProductType } from '../../common/api/collectionsApi';
import { TaxaCount } from './data_products/TaxaCount';

export const DataProduct: FC<{
  dataProduct: DataProductType;
  collection_id: string;
}> = ({ dataProduct, collection_id }) => {
  if (dataProduct.product === 'taxa_count') {
    return <TaxaCount {...{ collection_id }} />;
  } else {
    return <>'Invalid Data Product Type'</>;
  }
};
