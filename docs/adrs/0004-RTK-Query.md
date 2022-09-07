<!-- Short descriptive title -->

# RTK Query and Supporting Decisions

<!-- Date -->

_yyyy-mm-dd_

<!-- Summary -->

Strategies were investigated for handling kbase service (jsonrpc) API calls and
caching of responses. Goal was to create a simple developer experience for
fetching data from kbase services within components and hooks. Challenges
included caching, integrating caching with the redux store, and dealing with the
particular request format of jsonrpc (v1.1).

## Authors <!-- GitHub Username(s) -->

@dauglyon

## Status <!-- Status of this ADR -->

N/A

## Alternatives Considered <!-- Short list of considered alternatives, should include the chosen path -->

- Hand-roll a fetch-based JSONRpc client, and manage requests within individual
  feature slices.
- Use [RTK-query](https://redux-toolkit.js.org/rtk-query/overview) with a custom
  baseQuery
- Use [TanStack React Query](https://tanstack.com/query/v4/docs/overview) to
  handle caching and hooks, hand-roll integration with redux
- Use existing kbase-specific service client code, hand-roll integration with
  redux

## Decision Outcome <!-- Summary of the decision -->

Used RTK-query with a custom baseQuery to manage caching, jsonrpc logic, and
both async functions and hooks for running query (get-like) and mutation
(post-like) calls.

## Consequences <!-- Summary of the decision -->

Using RTK-query in our usecase requires a few supported but not wonderfully
documented deviations from the introductory rtk-query docs. These include:

1. A custom base query, implemented in `src/common/api/utils/kbaseBaseQuery.ts`.
   This allows all the api endpoints to share jsonrpc and authentication logic,
   it also lets us automatically fetch/cache URLs for dynamic services, again
   without too much developer overhead when making individual enpoints.
2. In order to have different services' endpoints split between files, but also
   to allow the APIs for different services to share cache "tags" (so, for
   instance, changing a narrative name can invalidate caches which may reference
   that narrative from other services), a single rtk-query API is created in
   `src/common/api/index.ts`. `injectEndpoints` is then used in each
   `src/common/api/[service].ts` file to add service-specific endpoints, these
   endpoints are then export and imported from the service-specfic file, but act
   on the api instance and cache defined in `.../index.ts`.
3. Because we also may want to use the endpoints _outside of react components_,
   we can instead export the endpoint objects, instead of the auto-generated
   hooks. The auto-generated hooks (and the `initiate` function to call the
   endpoint outside of a react component) are then availible as properties of
   those exported endpoints. More detail below.
4. A small helper util in `src/common/api/utils/kbService.ts` which handles
   defining the service type (static\[core\]/dynamic) and location, and returns
   a helper function that prevents that information from needing to be
   individually defined for every endpoint.

### Exporting Endpoints instead of Hooks

Instead of exporting Hooks:

```js
// common/api/userProfileApi
export const {
  useGetUserProfileQuery,
  useSetUserProfileQuery,
  useStatusQuery,
} = userProfileApi;
```

we can export Endpoints:

```js
// common/api/userProfileApi
export const { getUserProfile, setUserProfile, status } =
  userProfileApi.endpoints;
```

which means instead of directly using hooks:

```js
// features/auth/Auth.tsx
import { useGetUserProfileQuery } from '../../common/api/userProfileApi';
// ...
const profile = useGetUserProfileQuery(profileParams);
```

we use them like this:

```js
// features/auth/Auth.tsx
import { getUserProfile } from '../../common/api/userProfileApi';
// ...
const profile = getUserProfile.useQuery(profileParams);
```

Doing this is useful becase `[endpoint].initiate` can be used call the endpoint
outside of a react component (without having to add more exports). Further, in
my (@dauglyon) opinion this looks way nicer than the what is in rtk-query docs,
and it's still through their documented API.

```js
// some/non-component/function.js
import { getUserProfile } from '../../common/api/userProfileApi';
import { store } from '../../../app/store';
// ...
const args = {...};

const query = getUserProfile.initiate(args, subscribe: false);
await query;
const result = getUserProfile.select(args)(store.getState());

```

## Pros and Cons of the Alternatives <!-- List Pros/Cons of each considered alternative -->

### Use RTK-query with a custom baseQuery

- `+` Discoverable
- `-` Only exists in one repo, might be hard to use if more repos are created
  for the project.

### Hand-roll a fetch-based JSONRpc client, and manage requests within individual feature slices

- `+` Discoverable
- `-` Only exists in one repo, might be hard to use if more repos are created
  for the project.

### Use TanStack React Query to handle caching and hooks, hand-roll integration with redux

### Use existing kbase-specific service client code, hand-roll integration with redux

## References <!-- List any relevant resources about the ADR, consider using footnotes as below where useful -->

- [RTK Query comparison with other tools](https://redux-toolkit.js.org/rtk-query/comparison)
