import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { FetchAssetMetaFromAPIUC } from '../UCs/FetchAssetMetaFromAPIUC';

export class MockFetchAssetMetaFromAPIUC extends FetchAssetMetaFromAPIUC {
  doFetch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, FetchAssetMetaFromAPIUC.type);
  }
}

export function makeMockFetchAssetMetaFromAPIUC(appObjects: HostAppObjectRepo) {
  return new MockFetchAssetMetaFromAPIUC(appObjects.getOrCreate('MockFetchAssetMetaFromAPIUC'));
}
