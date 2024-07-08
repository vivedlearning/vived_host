import { HostAppObject } from "../../../HostAppObject";
import { IsAssetFetchedHandler } from "../UCs"

export class MockIsAssetFetchedHandler extends IsAssetFetchedHandler{
	action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, IsAssetFetchedHandler.type);
  }
}