import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { PostNewAssetUC } from '../UCs/PostNewAssetUC';

export class MockPostNewAssetUC extends PostNewAssetUC {
  doPost = jest.fn().mockResolvedValue({
    id: 'newAssetID',
    filename: 'newAssetFile.name',
  });

  constructor(appObject: HostAppObject) {
    super(appObject, PostNewAssetUC.type);
  }
}

export function makeMockPostNewAssetUC(appObjects: HostAppObjectRepo) {
  return new MockPostNewAssetUC(appObjects.getOrCreate('MockPostNewAssetUC'));
}
