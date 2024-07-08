import { HostAppObject } from "../../../HostAppObject";
import { GoToPreviousStateHandler } from "../UCs";

export class MockGoToPreviousStateHandler extends GoToPreviousStateHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GoToPreviousStateHandler.type);
  }
}
