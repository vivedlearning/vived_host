import { HostAppObject } from "../../../HostAppObject";
import { GetAssetBlobURLHandler, GetAssetBlobURLHandlerAction } from "../UCs";

export class MockGetAssetBlobURLHandler extends GetAssetBlobURLHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetBlobURLHandler.type);
  }
}
