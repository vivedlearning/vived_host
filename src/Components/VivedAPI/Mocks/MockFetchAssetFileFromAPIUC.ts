import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { FetchAssetFileFromAPIUC } from '../UCs/FetchAssetFileFromAPIUC';

export class MockFetchAssetFileFromAPIUC extends FetchAssetFileFromAPIUC {
  doFetch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, FetchAssetFileFromAPIUC.type);
  }
}

export function makeMockFetchAssetFileFromAPIUC(appObjects: HostAppObjectRepo) {
  return new MockFetchAssetFileFromAPIUC(appObjects.getOrCreate('MockFetchAssetFileFromAPIUC'));
}
