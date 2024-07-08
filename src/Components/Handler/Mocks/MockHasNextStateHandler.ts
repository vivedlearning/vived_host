import { HostAppObject } from "../../../HostAppObject";
import { HasNextStateHandler } from "../UCs";

export class MockHasNextStateHandler extends HasNextStateHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HasNextStateHandler.type);
  }
}
