import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeMockUserLoginUC } from '../Mocks/MockUserLoginUC';
import { refreshAuthenticatedUser } from './refreshAuthenticatedUser';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockLogin = makeMockUserLoginUC(appObjects);

  return { appObjects, mockLogin };
}

describe('Refresh Authenticated User Controller', () => {
  it('Toggles the value on the entity', () => {
    const { mockLogin, appObjects } = makeTestRig();

    refreshAuthenticatedUser(appObjects);

    expect(mockLogin.refreshAuthenticatedUser).toBeCalledWith();
  });
});
