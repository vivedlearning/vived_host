import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { DeleteAssetOnAPIUC } from '../UCs/DeleteAssetOnAPIUC';

export class MockDeleteAssetOnAPIUC extends DeleteAssetOnAPIUC {
  doDelete = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteAssetOnAPIUC.type);
  }
}

export function makeMockDeleteAssetOnAPIUC(appObjects: HostAppObjectRepo) {
  return new MockDeleteAssetOnAPIUC(appObjects.getOrCreate('DeleteAssetOnAPIUC'));
}
