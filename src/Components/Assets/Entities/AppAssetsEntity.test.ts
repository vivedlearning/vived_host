import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { AppAssetsEntity, makeAppAssets } from './AppAssetsEntity';
import { makeAssetEntity } from './AssetEntity';

function makeTestRig() {
  const appObjectRepo = makeHostAppObjectRepo();
  const appObject = appObjectRepo.getOrCreate('AppAssets');
  const spyRegisterSingleton = jest.spyOn(appObjectRepo, 'registerSingleton');

  const appAssets = makeAppAssets(appObject);
  const observer = jest.fn();
  appAssets.addChangeObserver(observer);

  return { appAssets, observer, appObjectRepo, spyRegisterSingleton };
}

describe('App Asset Sandbox Entity', () => {
  it('Notifies if an asset is added', () => {
    const { appAssets, observer } = makeTestRig();

    appAssets.add('app1');

    expect(observer).toBeCalled();
  });

  it('Adds the asset', () => {
    const { appAssets } = makeTestRig();

    expect(appAssets.getAll()).toHaveLength(0);

    appAssets.add('app1');

    expect(appAssets.getAll()).toHaveLength(1);
  });

  it('Notifies if the show archived flag changes', () => {
    const { appAssets, observer } = makeTestRig();

    expect(appAssets.showArchived).toEqual(false);

    appAssets.showArchived = true;

    expect(appAssets.showArchived).toEqual(true);
    expect(observer).toBeCalled();

    observer.mockClear();

    appAssets.showArchived = false;

    expect(appAssets.showArchived).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Does not notifies if the show flag is set but does not change', () => {
    const { appAssets, observer } = makeTestRig();

    expect(appAssets.showArchived).toEqual(false);

    appAssets.showArchived = false;
    appAssets.showArchived = false;
    appAssets.showArchived = false;

    expect(observer).not.toBeCalled();
  });

  it('Checks for an asset', () => {
    const { appAssets } = makeTestRig();

    expect(appAssets.has('asset1')).toEqual(false);
    appAssets.add('asset1');
    expect(appAssets.has('asset1')).toEqual(true);
  });

  it('Removes an asset', () => {
    const { appAssets, observer } = makeTestRig();
    appAssets.add('asset1');
    observer.mockClear();

    appAssets.remove('asset1');
    expect(appAssets.has('asset1')).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Does not notify if an asset is removed but it does not change the list', () => {
    const { appAssets, observer } = makeTestRig();

    appAssets.remove('asset1');
    appAssets.remove('asset1');
    appAssets.remove('asset1');

    expect(observer).not.toBeCalled();
  });

  it('Gets the singleton', () => {
    const { appAssets, appObjectRepo } = makeTestRig();
    expect(AppAssetsEntity.get(appObjectRepo)).toEqual(appAssets);
  });

  it('Registers as the singleton', () => {
    const { appAssets, spyRegisterSingleton } = makeTestRig();
    expect(spyRegisterSingleton).toBeCalledWith(appAssets);
  });

  it('Notifies when the editing asset is set', () => {
    const { appAssets, appObjectRepo, observer } = makeTestRig();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));

    observer.mockClear();

    appAssets.editingAsset = asset;
    appAssets.editingAsset = asset;
    appAssets.editingAsset = asset;

    expect(observer).toBeCalledTimes(1);

    observer.mockClear();

    appAssets.editingAsset = undefined;
    appAssets.editingAsset = undefined;
    appAssets.editingAsset = undefined;

    expect(observer).toBeCalledTimes(1);
  });

  it("Forwards notifications from the edited asset", ()=>{
    const { appAssets, appObjectRepo, observer } = makeTestRig();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    appAssets.editingAsset = asset;
    observer.mockClear();

    asset.name = "Something else";

    expect(observer).toBeCalled();
  })

  it("Stops forwarding notifications from the edited asset when cleared", ()=>{
    const { appAssets, appObjectRepo, observer } = makeTestRig();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    appAssets.editingAsset = asset;
    appAssets.editingAsset = undefined;
    observer.mockClear();

    asset.name = "Something else";

    expect(observer).not.toBeCalled();
  })
});
