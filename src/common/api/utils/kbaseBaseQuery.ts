import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../../../app/store';
import { serviceWizardApi } from '../serviceWizardApi';

interface StaticService {
  url: string;
}

interface DynamicService {
  name: string;
  release: string;
}

export interface kbQueryArgs {
  service: StaticService | DynamicService;
  method: string;
  params: unknown[];
  fetchArgs?: FetchArgs;
}

const isDynamic = (
  service: kbQueryArgs['service']
): service is DynamicService => {
  return (service as DynamicService).release !== undefined;
};

// These helpers let us avoid circular dependencies when using an API endpoint within kbaseBaseQuery
const consumedServices: { serviceWizardApi?: typeof serviceWizardApi } = {};
export const setConsumedService = <T extends keyof typeof consumedServices>(
  k: T,
  v: typeof consumedServices[T]
) => {
  consumedServices[k] = v;
};
export const getConsumedService = <T extends keyof typeof consumedServices>(
  k: T
) => {
  if (!consumedServices[k]) {
    throw new Error(`Consumed service ${k} was not set prior to use.`);
  }
  return consumedServices[k] as NonNullable<typeof consumedServices[T]>;
};

export const kbaseBaseQuery: (
  fetchBaseQueryArgs: FetchBaseQueryArgs
) => BaseQueryFn<kbQueryArgs, unknown, FetchBaseQueryError> = (
  fetchBaseQueryArgs
) => {
  // Add auth logic to base query args
  const modifiedArgs: FetchBaseQueryArgs = {
    ...fetchBaseQueryArgs,
    prepareHeaders: async (headers, api) => {
      if (fetchBaseQueryArgs.prepareHeaders) {
        await fetchBaseQueryArgs.prepareHeaders(headers, api);
      }
      const token = (api.getState() as RootState).auth.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `${token}`);
      }
      return headers;
    },
  };

  // generate base query
  const rawBaseQuery = fetchBaseQuery(modifiedArgs);

  // wrap base query to add error handling and return
  const kbQuery: BaseQueryFn<kbQueryArgs, unknown, FetchBaseQueryError> =
    async (kbQueryArgs, baseQueryAPI, extraOptions) => {
      // If this is a dynamic query, call service_wizard and transform it into a static one
      if (isDynamic(kbQueryArgs.service)) {
        // This api is provided via the query to prevent circular imports, fun
        const serviceStatusQuery =
          getConsumedService('serviceWizardApi').endpoints.serviceStatus;
        const wizardQueryArgs = {
          module_name: kbQueryArgs.service.name,
          version: kbQueryArgs.service.release,
        };

        // trigger query, subscribing until we grab the value
        const statusQuery = baseQueryAPI.dispatch(
          serviceStatusQuery.initiate(wizardQueryArgs, { subscribe: true })
        );

        // wait until the query completes
        await statusQuery;

        // Get query result from the cache after the query has completed
        const state = baseQueryAPI.getState() as RootState;
        const wizardResult = serviceStatusQuery.select(wizardQueryArgs)(state);

        // Raise any errors from the above call to service_wizard
        if (wizardResult.isError) {
          return { error: wizardResult.error as FetchBaseQueryError };
        }

        // Get URL from wizardResult, no error so assert as a string;
        const serviceUrl = wizardResult.data?.[0].url as string;

        // release the statusQuery sub
        statusQuery.unsubscribe();

        return kbQuery(
          {
            ...kbQueryArgs,
            service: { url: serviceUrl },
          },
          baseQueryAPI,
          extraOptions
        );
      }

      // Generate JsonRPC request id
      const reqId = Math.random();

      // generate request body
      const fetchArgs = {
        url: new URL(
          kbQueryArgs.service.url,
          fetchBaseQueryArgs.baseUrl
        ).toString(),
        method: 'POST',
        body: {
          version: '1.1', // TODO: conditionally implement JsonRpc 2.0
          id: reqId,
          method: kbQueryArgs.method,
          params: kbQueryArgs.params,
        },
        ...kbQueryArgs.fetchArgs, // Allow overriding JsonRpc defaults
      };

      // make request
      const request = rawBaseQuery(fetchArgs, baseQueryAPI, extraOptions);
      const response = await request;

      // If an error has occured preventing a response, return default rtk-query response.
      // This appropriately handles rtk-query internal errors
      if (!response.data) return request;

      const data = response.data as {
        version: string;
        result?: unknown;
        error?: unknown;
        id?: number;
      };

      // If the IDs don't match, fail
      // TODO: find out if this is the idiomatic way to do this
      if (data.id && data.id !== reqId)
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: 'JsonRpcProtocolError',
            data: `Response ID "${data.id}" !== Request ID "${reqId}"`,
          },
        };

      // If we get a JsonRPC error, surface that error
      if (data.error)
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: 'JsonRpcError',
            data: data.error,
          },
        };

      // All went well, return the JsonRPC result
      return { data: data.result };
    };
  return kbQuery;
};
