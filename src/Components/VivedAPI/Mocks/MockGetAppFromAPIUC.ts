import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { GetAppFromAPIUC } from '../UCs/GetAppFromAPIUC';

export class MockGetAppFromAPIUC extends GetAppFromAPIUC {
  getApp = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAppFromAPIUC.type);
  }
}

export function makeMockGetAppFromAPIUC(appObjects: HostAppObjectRepo) {
  return new MockGetAppFromAPIUC(appObjects.getOrCreate('MockGetAppFromAPIUC'));
}
