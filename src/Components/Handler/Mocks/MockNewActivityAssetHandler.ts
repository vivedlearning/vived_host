import { HostAppObject } from "../../../HostAppObject";
import { NewActivityAssetHandler } from "../UCs";

export class MockNewActivityAssetHandler extends NewActivityAssetHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, NewActivityAssetHandler.type);
  }
}
