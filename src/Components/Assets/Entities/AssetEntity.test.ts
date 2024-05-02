import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity, makeAsset } from './AssetEntity';

function makeTestRig() {
  const appObjectRepo = makeHostAppObjectRepo();
  const appObject = appObjectRepo.getOrCreate('asset1');
  const asset = makeAsset(appObject);
  const observer = jest.fn();
  asset.addChangeObserver(observer);
  return { asset, observer, appObject, appObjectRepo };
}

describe('Asset Entity', () => {
  it('Stores the ID', () => {
    const { asset } = makeTestRig();
    expect(asset.id).toEqual('asset1');
  });

  it('Notifies when the archived flag changes', () => {
    const { asset, observer } = makeTestRig();

    expect(asset.archived).toEqual(false);

    asset.archived = true;

    expect(asset.archived).toEqual(true);
    expect(observer).toBeCalled();

    observer.mockClear();

    asset.archived = false;

    expect(asset.archived).toEqual(false);
    expect(observer).toBeCalled();
  });

  it('Does not notify if there is no change in the archived val', () => {
    const { asset, observer } = makeTestRig();

    expect(asset.archived).toEqual(false);

    asset.archived = false;
    asset.archived = false;
    asset.archived = false;

    expect(observer).not.toBeCalled();
  });

  it('Notifies when the name changes', () => {
    const { asset, observer } = makeTestRig();

    expect(asset.name).toEqual('');

    asset.name = 'A Name';

    expect(asset.name).toEqual('A Name');
    expect(observer).toBeCalled();
  });

  it('Does not notify if there is no change in the name val', () => {
    const { asset, observer } = makeTestRig();

    asset.name = 'A Name';
    observer.mockClear();

    asset.name = 'A Name';
    asset.name = 'A Name';
    asset.name = 'A Name';

    expect(observer).not.toBeCalled();
  });

  it('Notifies when the description changes', () => {
    const { asset, observer } = makeTestRig();

    expect(asset.description).toEqual('');

    asset.description = 'A desc';

    expect(asset.description).toEqual('A desc');
    expect(observer).toBeCalled();
  });

  it('Does not notify if there is no change in the description val', () => {
    const { asset, observer } = makeTestRig();

    asset.description = 'A desc';
    observer.mockClear();

    asset.description = 'A desc';
    asset.description = 'A desc';
    asset.description = 'A desc';

    expect(observer).not.toBeCalled();
  });

  it('Notifies when the filename changes', () => {
    const { asset, observer } = makeTestRig();

    expect(asset.description).toEqual('');

    asset.filename = 'someFile.file';

    expect(asset.filename).toEqual('someFile.file');
    expect(observer).toBeCalled();
  });

  it('Does not notify if there is no change in the filename val', () => {
    const { asset, observer } = makeTestRig();

    asset.filename = 'someFile.file';
    observer.mockClear();

    asset.filename = 'someFile.file';
    asset.filename = 'someFile.file';
    asset.filename = 'someFile.file';

    expect(observer).not.toBeCalled();
  });

  it('Notifies when the blob url changes', () => {
    const { asset, observer } = makeTestRig();

    URL.createObjectURL = jest.fn().mockReturnValue('www.aURL.com');

    expect(asset.blobURL).toBeUndefined();

    const file = new File([], 'a.file');

    asset.setFile(file);

    expect(asset.blobURL).toEqual('www.aURL.com');
    expect(observer).toBeCalled();
  });

  it('Stores the file', () => {
    const { asset } = makeTestRig();

    URL.createObjectURL = jest.fn().mockReturnValue('www.aURL.com');

    expect(asset.file).toBeUndefined();

    const file = new File([], 'a.file');

    asset.setFile(file);

    expect(asset.file).toEqual(file);
  });

  it('Gets the component off an app object', () => {
    const { asset, appObject } = makeTestRig();

    expect(AssetEntity.get(appObject)).toEqual(asset);
  });

  it('Warns if it cannot find the asset on an AO', () => {
    const { appObjectRepo } = makeTestRig();

    const newAO = appObjectRepo.getOrCreate('AnAppObject');
    appObjectRepo.submitWarning = jest.fn();

    expect(AssetEntity.get(newAO)).toEqual(undefined);
    expect(appObjectRepo.submitWarning).toBeCalled();
  });
});
