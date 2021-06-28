import { DispatchToAppUC } from './boundary';
import { DispatchToAppUCImp } from './UseCase';

export * from './boundary';
export function makeDispatchToAppUC(): DispatchToAppUC {
  return new DispatchToAppUCImp();
}
