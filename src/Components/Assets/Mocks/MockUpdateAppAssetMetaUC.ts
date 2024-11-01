import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { UpdateAppAssetMetaUC } from "../UCs/UpdateAppAssetMetaUC";

export class MockUpdateAppAssetMetaUC extends UpdateAppAssetMetaUC {
  updateMeta = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, UpdateAppAssetMetaUC.type);
  }
}

export function makeMockUpdateAppAssetMetaUC(appObjects: HostAppObjectRepo) {
  return new MockUpdateAppAssetMetaUC(
    appObjects.getOrCreate("MockUpdateAppAssetMetaUC")
  );
}
