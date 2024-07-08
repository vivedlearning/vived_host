import { HostAppObject } from "../../../HostAppObject";
import { OnAppIsReadyHandler } from "../UCs";

export class MockOnAppIsReadyHandler extends OnAppIsReadyHandler {
  action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, OnAppIsReadyHandler.type);
  }
}
