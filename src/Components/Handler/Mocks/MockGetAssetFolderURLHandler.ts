import { HostAppObject } from "../../../HostAppObject";
import { GetAssetFolderURLAction, GetAssetFolderURLHandler } from "../UCs";

export class MockGetAssetFolderURLHandler extends GetAssetFolderURLHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetFolderURLHandler.type);
  }
}
