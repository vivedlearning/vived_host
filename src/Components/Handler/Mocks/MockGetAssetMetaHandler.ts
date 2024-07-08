import { HostAppObject } from "../../../HostAppObject";
import { GetAssetMetaHandler } from "../UCs";

export class MockGetAssetMetaHandler extends GetAssetMetaHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetMetaHandler.type);
  }
}
