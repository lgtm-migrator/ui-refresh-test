import { baseApi } from './index';
import { kbService } from './utils/kbService';

const collections = kbService({ url: 'services/collections' });

type Collection = unknown;
type CollectionSummary = unknown;

interface CollectionsParams {
  listCollections: void;
  getCollection: { collection_id: string };
}

interface CollectionsResults {
  listCollections: CollectionSummary[];
  getCollection: Collection;
}

export const collectionsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Collection'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      listCollections: builder.query<
        CollectionsResults['listCollections'],
        CollectionsParams['listCollections']
      >({
        query: () =>
          collections({
            method: 'Collections.list_collections',
            params: [],
          }),
        keepUnusedDataFor: 300,
        providesTags: (result, error) =>
          (result || []).map((collectionSummary) => ({
            type: 'Collection',
            id: collectionSummary.id,
          })),
      }),

      getCollection: builder.query<
        CollectionsResults['getCollection'],
        CollectionsParams['getCollection']
      >({
        query: ({ collection_id }) =>
          collections({
            method: 'Collections.list_collections',
            params: [{ collection_id }],
          }),
        keepUnusedDataFor: 300,
        providesTags: (result, error, { collection_id }) => [
          { type: 'Collection', id: collection_id },
        ],
      }),
    }),
  });

export const { useListCollectionsQuery, useGetCollectionQuery } =
  collectionsApi;
