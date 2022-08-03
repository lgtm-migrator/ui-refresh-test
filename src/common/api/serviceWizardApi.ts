import { baseApi } from './index';
import { setConsumedService } from './utils/kbaseBaseQuery';

export const serviceWizardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    serviceStatus: builder.query<
      [
        {
          git_commit_hash: string;
          status: string;
          version: string;
          hash: string;
          release_tags: string[];
          url: string;
          module_name: string;
          health: string;
          up: number;
        }
      ],
      { module_name: string; version: string }
    >({
      query: ({ module_name, version }) => ({
        // cant use the kbService helper here, as it creates a circular dependency
        service: { url: 'services/service_wizard' },
        method: 'ServiceWizard.get_service_status',
        params: [{ module_name, version }],
      }),
    }),
  }),
});

export const { useServiceStatusQuery } = serviceWizardApi;

setConsumedService('serviceWizardApi', serviceWizardApi);
