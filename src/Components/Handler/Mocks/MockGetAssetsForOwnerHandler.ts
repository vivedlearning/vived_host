import { HostAppObject } from "../../../HostAppObject";
import { GetAssetsForOwnerHandler } from "../UCs";

export class MockGetAssetsForOwnerHandler extends GetAssetsForOwnerHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetsForOwnerHandler.type);
  }
}
