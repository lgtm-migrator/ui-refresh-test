import { uriEncodeTemplateTag as encode } from '../utils/stringUtils';
import { baseApi } from './index';
import { httpService } from './utils/serviceHelpers';

const collectionsService = httpService({
  url: 'services/collectionsservice',
});

interface DataProduct {
  product: string;
  // unknown
}

interface DataProductRef {
  product: string;
  version: string;
}

interface Collection {
  id: string;
  name: string;
  version_tag: string;
  version_num: number;
  source_version: string;
  icon: string;
  creation_date: string;
  activation_date: string;
  data_products: DataProductRef[];
}

interface CollectionsResults {
  status: {
    service_name: string;
    version: string;
    git_hash: string;
    server_time: string;
  };
  listCollections: Collection[];
  getCollection: Collection;
  saveCollection: Collection;
  activateVersion: void;
  getDataProduct: DataProduct;
}

interface CollectionsParams {
  status: void;
  listCollections: void;
  getCollection: Collection['id'];
  saveCollection: Omit<Collection, 'version_num'>;
  activateVersion:
    | Pick<Collection, 'id' | 'version_tag'>
    | Pick<Collection, 'id' | 'version_num'>;
  getDataProduct: { id: Collection['id']; product: DataProduct['product'] };
}

// Auth does not use JSONRpc, so we use queryFn to make custom queries
export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    collectionsStatus: builder.query<
      CollectionsResults['status'],
      CollectionsParams['status']
    >({
      query: () => collectionsService({ method: 'GET', url: `/` }),
    }),

    listCollections: builder.query<
      CollectionsResults['listCollections'],
      CollectionsParams['listCollections']
    >({
      // query: () => collectionsService({ method: 'GET', url: `/collections` }),
      queryFn: () => ({
        data: [
          mockCollection(),
          mockCollection(),
          mockCollection(),
          mockCollection(),
          mockCollection(),
        ],
      }),
    }),

    getCollection: builder.query<
      CollectionsResults['getCollection'],
      CollectionsParams['getCollection']
    >({
      // query: (id) =>
      //   collectionsService({ method: 'GET', url: encode`/collections/${id}` }),
      queryFn: (id) => ({ data: mockCollection({ id }) }),
    }),

    saveCollection: builder.mutation<
      CollectionsResults['saveCollection'],
      CollectionsParams['saveCollection']
    >({
      query: (collection) =>
        collectionsService({
          method: 'PUT',
          url: encode`/collections/${collection.id}/versions/${collection.version_tag}`,
        }),
    }),

    activateVersion: builder.mutation<
      CollectionsResults['activateVersion'],
      CollectionsParams['activateVersion']
    >({
      query: ({ id, ...params }) =>
        collectionsService({
          method: 'PUT',
          url:
            'version_num' in params
              ? encode`/collections/${id}/versions/num/${params.version_num}/activate`
              : encode`/collections/${id}/versions/tag/${params.version_tag}/activate`,
        }),
    }),

    getDataProduct: builder.query<
      CollectionsResults['getDataProduct'],
      CollectionsParams['getDataProduct']
    >({
      query: ({ id, product }) =>
        collectionsService({
          method: 'GET',
          url: encode`/collections/${id}/data/${product}/`,
        }),
    }),
  }),
});
export const {
  collectionsStatus: status,
  listCollections,
  getCollection,
  saveCollection,
  activateVersion,
  getDataProduct,
} = collectionsApi.endpoints;

const mockCollection = (override?: Partial<Collection>): Collection => {
  const randoNum = Math.floor(Math.random() * 1000000000);
  const id = Number(override?.id) || randoNum;
  return {
    id: String(id),
    name: `Some Collection with ID ${id}`,
    version_tag: `tag_${id}`,
    version_num: id,
    source_version: 'foo_bar_baz',
    icon: `https://picsum.photos/seed/${id}/64`,
    creation_date: new Date().toString(),
    activation_date: new Date().toString(),
    data_products: [],
    ...override,
  };
};
