import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { GetAssetsForOwnerFromAPIUC } from '../UCs/GetAssetsForOwnerFromAPIUC';

export class MockGetAssetsForOwnerFromAPIUC extends GetAssetsForOwnerFromAPIUC {
  getAssets = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetsForOwnerFromAPIUC.type);
  }
}

export function makeMockGetAssetsForOwnerFromAPIUC(appObjects: HostAppObjectRepo) {
  return new MockGetAssetsForOwnerFromAPIUC(appObjects.getOrCreate('MockGetAssetsForOwnerFromAPIUC'));
}
