import { HostAppObject } from "../../../HostAppObject";
import { IsZSpaceAvailableHandler } from "../UCs";

export class MockIsZSpaceAvailableHandler extends IsZSpaceAvailableHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, IsZSpaceAvailableHandler.type);
  }
}
