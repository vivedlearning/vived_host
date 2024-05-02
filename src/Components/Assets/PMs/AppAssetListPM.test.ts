import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { AppAssetListPM } from './AppAssetListPM';
import { makeAppAssets } from '../Entities/AppAssetsEntity';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  const ao = appObjects.getOrCreate('AppAssets');
  const appAssets = makeAppAssets(ao);
  const pm = new AppAssetListPM(ao);

  const doUpdateSpy = jest.spyOn(pm, 'doUpdateView');

  return { pm, appAssets, registerSingletonSpy, appObjects, doUpdateSpy };
}

describe('App Assets List PM', () => {
  it('Registers as the singleton', () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it('Gets the singleton', () => {
    const { appObjects, pm } = makeTestRig();

    expect(AppAssetListPM.get(appObjects)).toEqual(pm);
  });

  it('Checks for equal VM Lists', () => {
    const { pm } = makeTestRig();

    const list1 = ['id1', 'id2'];

    const list2 = [...list1];

    expect(pm.vmsAreEqual(list1, list2)).toEqual(true);
  });

  it('Checks for an item missing in the VM Lists', () => {
    const { pm } = makeTestRig();

    const list1 = ['id1', 'id2'];

    const list2 = ['id1'];

    expect(pm.vmsAreEqual(list1, list2)).toEqual(false);
  });

  it('Checks for an item added to the VM Lists', () => {
    const { pm } = makeTestRig();

    const list1 = ['id1', 'id2'];

    const list2 = [...list1, 'id3'];

    expect(pm.vmsAreEqual(list1, list2)).toEqual(false);
  });

  it('Checks for a change in the list', () => {
    const { pm } = makeTestRig();

    const list1 = ['id1', 'id2'];

    const list2 = ['id1', 'somethingElse'];

    expect(pm.vmsAreEqual(list1, list2)).toEqual(false);
  });

  it('Instantiates the last VM', () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it('Updates the VM when the App Assets Entity changes', () => {
    const { doUpdateSpy, appAssets } = makeTestRig();

    doUpdateSpy.mockClear();

    appAssets.add('assetID');

    expect(doUpdateSpy).toBeCalledWith(['assetID']);
  });
});
