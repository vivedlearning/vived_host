import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeMockUserLoginUC } from '../Mocks/MockUserLoginUC';
import { loginUser } from './loginUser';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockLogin = makeMockUserLoginUC(appObjects);

  return { appObjects, mockLogin };
}

describe('Login User Controller', () => {
  it('Toggles the value on the entity', () => {
    const { mockLogin, appObjects } = makeTestRig();

    loginUser('userName', 'password', appObjects);

    expect(mockLogin.login).toBeCalledWith('userName', 'password');
  });
});
