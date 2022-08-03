import { kbaseBaseQuery } from './utils/kbaseBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'combinedApi',
  baseQuery: kbaseBaseQuery({ baseUrl: 'https://ci.kbase.us/' }),
  // Forces refetch when new subs are made to endpoints, every five minutes right now
  // basically, this is our cache timeout
  refetchOnMountOrArgChange: 300,
  endpoints: () => ({}),
});
