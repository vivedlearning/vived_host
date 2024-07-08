import { HostAppObject } from "../../../HostAppObject";
import { HasPreviousStateHandler } from "../UCs";

export class MockHasPreviousStateHandler extends HasPreviousStateHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HasPreviousStateHandler.type);
  }
}
