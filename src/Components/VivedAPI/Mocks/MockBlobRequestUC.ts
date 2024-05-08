import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { BlobRequestUC } from "../UCs/BlobRequestUC";

export class MockBlobRequestUC extends BlobRequestUC {
  doRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MockBlobRequestUC.type);
  }
}

export function makeMockBlobRequestUC(appObjects: HostAppObjectRepo) {
  return new MockBlobRequestUC(appObjects.getOrCreate("MockBlobRequestUC"));
}
