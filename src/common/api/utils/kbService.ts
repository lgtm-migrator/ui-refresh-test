import { KbQueryArgs } from './kbaseBaseQuery';

// Helper for adding service info to each query,
export const kbService = (
  service: KbQueryArgs['service']
): ((kba: Omit<KbQueryArgs, 'service'>) => KbQueryArgs) => {
  return (kba) => ({ ...kba, service: service as KbQueryArgs['service'] });
};
