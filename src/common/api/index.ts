import { kbaseBaseQuery } from './utils/kbaseBaseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

const ENV = process.env.REACT_APP_KBASE_ENV;
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : `https://${ENV === 'PROD' ? '' : `${ENV}.`}kbase.us`;

export const baseApi = createApi({
  reducerPath: 'combinedApi',
  baseQuery: kbaseBaseQuery({ baseUrl }),
  endpoints: () => ({}),
});
