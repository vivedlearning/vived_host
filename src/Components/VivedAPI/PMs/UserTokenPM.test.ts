import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { VivedAPIEntity } from '../Entities';
import { UserTokenPM } from './UserTokenPM';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate('AO');
  const vivedAPI = new VivedAPIEntity(ao);

  const registerSingletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  const pm = new UserTokenPM(ao);

  return { pm, registerSingletonSpy, vivedAPI, appObjects };
}

describe('UserTokenPM', () => {
  it('Initializes the last vm', () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it('Registers as the singleton', () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it('Gets the singleton', () => {
    const { appObjects, pm } = makeTestRig();

    expect(UserTokenPM.get(appObjects)).toEqual(pm);
  });

  it('Test for equal vms', () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual('token1', 'token1')).toEqual(true);
    expect(pm.vmsAreEqual('token1', 'token2')).toEqual(false);
  });

  it('Updates the vm when the entity changes', () => {
    const { pm, vivedAPI } = makeTestRig();

    vivedAPI.userToken = 'someToken';

    expect(pm.lastVM).toEqual('someToken');
  });
});
