import { DynamicService, kbQueryArgs } from './kbaseBaseQuery';
import { serviceWizardApi } from '../serviceWizardApi';

// Helper for adding service info to each query,
// also injects the serviceWizardApi for dynamic services
export const kbService = (
  service: Omit<kbQueryArgs['service'], 'serviceWizardApi'>
): ((kba: Omit<kbQueryArgs, 'service'>) => kbQueryArgs) => {
  // Provide serviceWizardApi if it isnt explicitly passed
  if ((service as DynamicService).serviceWizardApi === undefined) {
    const dyn = service as DynamicService;
    dyn.serviceWizardApi = serviceWizardApi;
  }
  return (kba) => ({ ...kba, service: service as kbQueryArgs['service'] });
};
