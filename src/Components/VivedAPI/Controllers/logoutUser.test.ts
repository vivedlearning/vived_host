import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeMockUserLoginUC } from '../Mocks/MockUserLoginUC';
import { logoutUser } from './logoutUser';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockLogin = makeMockUserLoginUC(appObjects);

  return { appObjects, mockLogin };
}

describe('Logout User Controller', () => {
  it('Toggles the value on the entity', () => {
    const { mockLogin, appObjects } = makeTestRig();

    logoutUser(appObjects);

    expect(mockLogin.logout).toBeCalledWith();
  });
});
