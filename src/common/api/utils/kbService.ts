import { kbQueryArgs } from './kbaseBaseQuery';

// Helper for adding service info to each query,
export const kbService = (
  service: kbQueryArgs['service']
): ((kba: Omit<kbQueryArgs, 'service'>) => kbQueryArgs) => {
  return (kba) => ({ ...kba, service: service as kbQueryArgs['service'] });
};
