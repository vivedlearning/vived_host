import { HostAppObject } from "../../../HostAppObject";
import { OnStateChangeHandler } from "../UCs";

export class MockOnStateChangeHandler extends OnStateChangeHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, OnStateChangeHandler.type);
  }
}
