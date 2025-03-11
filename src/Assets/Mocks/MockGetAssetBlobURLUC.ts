import { AppObject, AppObjectRepo } from "@vived/core";
import { GetAssetBlobURLUC } from "../UCs/GetAssetBlobURLUC";

export class MockGetAssetBlobURLUC extends GetAssetBlobURLUC {
  getAssetBlobURL = jest.fn().mockResolvedValue("www.someBlobURL.com");

  constructor(appObject: AppObject) {
    super(appObject, GetAssetBlobURLUC.type);
  }
}

export function makeMockGetAssetBlobURLUC(appObjects: AppObjectRepo) {
  return new MockGetAssetBlobURLUC(appObjects.getOrCreate("MockGetAssetUC"));
}
