import { RootState } from '../../app/store';
import { baseApi } from './index';

const AUTH_SERVICE_URL = '/services/auth';

interface TokenResponse {
  created: number;
  expires: number;
  id: string;
  name: string | null;
  type: string;
  user: string;
  cachefor: number;
}

// Auth does not use JSONRpc, so we use queryFn to make custom queries
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    authFromToken: builder.query<TokenResponse, string>({
      queryFn: async (token) => {
        let resp: Response | undefined;
        try {
          resp = await fetch(`${AUTH_SERVICE_URL}/api/V2/token`, {
            method: 'GET',
            headers: {
              Authorization: token || '',
            },
          });
        } catch (e) {
          console.error('Authentication Error.'); // eslint-disable-line no-console
          throw e;
        }
        if (typeof resp === 'undefined' || !resp.ok) {
          let errmsg = resp.statusText;
          try {
            const e = (await resp.json()).error;
            errmsg += `: ${e.message}`;
          } catch (e) {
            console.error('Error processing error message.'); // eslint-disable-line no-console
            throw e;
          }
          throw new Error(`Failed to validate token: "${errmsg}"`);
        }
        const tokenInfo = (await resp.json()) as TokenResponse;
        return { data: tokenInfo };
      },
    }),
    revokeToken: builder.mutation<boolean, string>({
      queryFn: async (tokenId, baseQueryApi) => {
        const token = (baseQueryApi.getState() as RootState).auth.token;
        if (!tokenId) {
          throw new Error('Failed to revoke token: No token ID to revoke');
        }
        const resp = await fetch(
          `${AUTH_SERVICE_URL}/tokens/revoke/${tokenId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: token || '',
            },
          }
        );
        if (!resp.ok) {
          throw new Error(`Failed to revoke token: ${resp.statusText}`);
        }
        return { data: true };
      },
    }),
  }),
});

export const { authFromToken, revokeToken } = authApi.endpoints;
