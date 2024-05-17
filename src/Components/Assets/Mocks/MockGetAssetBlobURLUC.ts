import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAssetBlobURLUC } from "../UCs/GetAssetBlobURLUC";

export class MockGetAssetBlobURLUC extends GetAssetBlobURLUC {
  getAssetBlobURL = jest.fn().mockResolvedValue("www.someBlobURL.com");

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetBlobURLUC.type);
  }
}

export function makeMockGetAssetBlobURLUC(appObjects: HostAppObjectRepo) {
  return new MockGetAssetBlobURLUC(appObjects.getOrCreate("MockGetAssetUC"));
}
