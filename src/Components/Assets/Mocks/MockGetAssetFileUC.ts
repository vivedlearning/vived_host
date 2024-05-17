import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAssetFileUC } from "../UCs/GetAssetFileUC";

export class MockGetAssetFileUC extends GetAssetFileUC {
  getAssetFile = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetFileUC.type);
  }
}

export function makeMockGetAssetFileUC(appObjects: HostAppObjectRepo) {
  return new MockGetAssetFileUC(appObjects.getOrCreate("MockGetAssetFileUC"));
}
