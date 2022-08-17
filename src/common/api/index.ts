import { kbaseBaseQuery } from './utils/kbaseBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'combinedApi',
  baseQuery: kbaseBaseQuery({ baseUrl: 'http://localhost:3000/' }),
  endpoints: () => ({}),
});
