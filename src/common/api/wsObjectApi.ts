import { baseApi } from './index';
import { kbService } from './utils/kbService';

const wsObject = kbService({
  url: '/services/ws',
});

interface wsObjectParams {
  getwsObjectByName: { upa: string };
}

interface wsObjectResults {
  getwsObjectByName: unknown;
}

const wsObjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getwsObjectByName: builder.query<
      wsObjectResults['getwsObjectByName'],
      wsObjectParams['getwsObjectByName']
    >({
      query: ({ upa }) =>
        wsObject({
          method: 'Workspace.get_objects2',
          params: [{ objects: [{ ref: upa }] }],
        }),
    }),
  }),
});

export const { useGetwsObjectByNameQuery } = wsObjectApi;
