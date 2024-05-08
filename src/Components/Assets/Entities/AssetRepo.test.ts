import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { makeAssetEntity } from './AssetEntity';
import { AssetRepo, makeAssetRepo } from './AssetRepo';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const repoAO = appObjects.getOrCreate('AssetRepo');
  const singletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  const assetRepo = makeAssetRepo(repoAO);
  const observer = jest.fn();
  assetRepo.addChangeObserver(observer);

  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  return { assetRepo, appObjects, singletonSpy, observer };
}

describe('Asset Repository', () => {
  it('Registers itself as the Singleton', () => {
    const { assetRepo, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(assetRepo);
  });

  it('Gets the singleton', () => {
    const { assetRepo, appObjects } = makeTestRig();

    expect(AssetRepo.get(appObjects)).toEqual(assetRepo);
  });

  it('Adds an asset', () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    const newAsset = assetRepo.assetFactory('asset1');

    assetRepo.add(newAsset);
    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it('Creates an asset if it does not exist', () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    assetRepo.getOrCreate('asset1');
    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it('Gets an asset', () => {
    const { assetRepo } = makeTestRig();

    const asset = assetRepo.getOrCreate('asset1');

    expect(assetRepo.get('asset1')).toEqual(asset);
    expect(assetRepo.get('somethingElse')).toEqual(undefined);
  });

  it('Checks for an asset', () => {
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate('asset1');

    expect(assetRepo.has('asset1')).toEqual(true);
    expect(assetRepo.has('somethingElse')).toEqual(false);
  });

  it('Only creates the asset if it does not exist', () => {
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');

    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it('Notifies when the asset is created', () => {
    const { assetRepo, observer } = makeTestRig();

    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');
    assetRepo.getOrCreate('asset1');

    expect(observer).toBeCalledTimes(1);
  });

  it('Only adds new assets', () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    const newAsset = assetRepo.assetFactory('asset1');

    assetRepo.add(newAsset);
    assetRepo.add(newAsset);
    assetRepo.add(newAsset);

    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it('Only notifies when a new asset is added', () => {
    const { assetRepo, observer } = makeTestRig();

    const newAsset = assetRepo.assetFactory('asset1');

    assetRepo.add(newAsset);
    assetRepo.add(newAsset);
    assetRepo.add(newAsset);

    expect(observer).toBeCalledTimes(1);
  });

  it("Removes an asset", ()=>{
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate('asset1');
    expect(assetRepo.getAll()).toHaveLength(1);
    expect(assetRepo.has('asset1')).toEqual(true);

    assetRepo.remove("asset1");

    expect(assetRepo.getAll()).toHaveLength(0);
    expect(assetRepo.has('asset1')).toEqual(false);
  })

  it("Notifies when an asset is removed", ()=>{
    const { assetRepo, observer } = makeTestRig();

    assetRepo.getOrCreate('asset1');
    observer.mockClear();


    assetRepo.remove("asset1");
    assetRepo.remove("asset1");
    assetRepo.remove("asset1");
    assetRepo.remove("asset1");

    expect(observer).toBeCalledTimes(1);
  })

  it("Gets assets for an owner", ()=>{
    const { assetRepo, observer } = makeTestRig();

    const asset1 = assetRepo.getOrCreate('asset1');
    const asset2 = assetRepo.getOrCreate('asset2');
    const asset3 = assetRepo.getOrCreate('asset3');

    asset1.owner = "owner1";
    asset2.owner = "owner1";
    asset3.owner = "owner2";

    const assetForOwner = assetRepo.getAssetsForOwner("owner1");

    expect(assetForOwner).toHaveLength(2);
    expect(assetForOwner).toEqual([
      asset1,
      asset2
    ])
  })
});
