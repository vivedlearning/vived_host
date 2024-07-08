import { HostAppObject } from "../../../HostAppObject";
import { OnStateCompleteHandler } from "../UCs";

export class MockOnStateCompleteHandler extends OnStateCompleteHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, OnStateCompleteHandler.type);
  }
}
