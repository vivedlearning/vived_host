import { HostAppObject } from "../../../HostAppObject";
import { GetLinkedAssetsHandler } from "../UCs/GetLinkedAssetsHandler";

export class MockGetLinkedAssetsHandler extends GetLinkedAssetsHandler {
	action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GetLinkedAssetsHandler.type);
  }
}