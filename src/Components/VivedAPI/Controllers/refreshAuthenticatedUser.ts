import { HostAppObjectRepo } from '../../../HostAppObject';
import { UserAuthUC } from '../UCs';

export function refreshAuthenticatedUser(appObjects: HostAppObjectRepo): Promise<void> {
  const uc = UserAuthUC.get(appObjects);

  if (uc) {
    return uc.refreshAuthenticatedUser();
  } else {
    appObjects.submitError('refreshAuthenticatedUser', 'Unable to find UserAuthUC');
    return Promise.reject(new Error('Unable to find UserAuthUC'));
  }
}
