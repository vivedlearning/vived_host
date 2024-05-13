import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { AppAssetListPM } from './AppAssetListPM';
import { makeAppAssets } from '../Entities/AppAssetsEntity';
import { makeAssetEntity } from '../Entities/AssetEntity';
import { makeAssetRepo } from '../Entities/AssetRepo';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  const ao = appObjects.getOrCreate('AppAssets');
  const appAssets = makeAppAssets(ao);

  const assetRepo = makeAssetRepo(appObjects.getOrCreate('AssetRepo'));

  const asset1 = makeAssetEntity(appObjects.getOrCreate('asset1'));
  const asset2 = makeAssetEntity(appObjects.getOrCreate('asset2'));
  asset2.archived = true;

  assetRepo.add(asset1);
  assetRepo.add(asset2);

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

  it('Uses all assets if the show archived is set to true', () => {
    const { pm, appAssets } = makeTestRig();

    appAssets.add('asset1');
    appAssets.add('asset2');
    appAssets.showArchived = true;

    expect(pm.lastVM).toEqual(['asset1', 'asset2']);
  });

  it('Only uses non-archived assets if the show archived flag is false', () => {
    const { doUpdateSpy, appAssets, pm } = makeTestRig();

    appAssets.add('asset1');
    appAssets.add('asset2');
    appAssets.showArchived = false;

    expect(pm.lastVM).toEqual(['asset1']);

    expect(pm.lastVM).toEqual(['asset1']);
  });
});
