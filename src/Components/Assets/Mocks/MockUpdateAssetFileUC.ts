import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { UpdateAssetFileUC } from "../UCs/UpdateAssetFileUC";


export class MockUpdateAssetFileUC extends UpdateAssetFileUC {
  updateFile= jest.fn().mockResolvedValue("newFile.name");

  constructor(appObject: HostAppObject) {
    super(appObject, UpdateAssetFileUC.type);
  }
}

export function makeMockUpdateAssetFileUC(appObjects: HostAppObjectRepo) {
  return new MockUpdateAssetFileUC(
    appObjects.getOrCreate("MockUpdateAssetFileUC")
  );
}
