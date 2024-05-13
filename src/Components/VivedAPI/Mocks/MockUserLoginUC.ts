import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { UserAuthUC } from '../UCs/UserAuthUC';

export class MockUserAuthUC extends UserAuthUC {
  login = jest.fn().mockResolvedValue(undefined);
  logout = jest.fn().mockResolvedValue(undefined);
  refreshAuthenticatedUser = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, UserAuthUC.type);
  }
}

export function makeMockUserLoginUC(appObjects: HostAppObjectRepo) {
  return new MockUserAuthUC(appObjects.getOrCreate('MockUserAuthUC'));
}
