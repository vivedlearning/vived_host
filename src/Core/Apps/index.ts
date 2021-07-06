import { AppsUC } from './boundary';
import { AppsUCImp } from './UseCase';

export * from './boundary';
export function makeAppsUC(): AppsUC {
  return new AppsUCImp();
}
