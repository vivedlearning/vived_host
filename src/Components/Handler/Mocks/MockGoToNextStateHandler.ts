import { HostAppObject } from "../../../HostAppObject";
import { GoToNextStateHandler } from "../UCs";

export class MockGoToNextStateHandler extends GoToNextStateHandler {
	action = jest.fn();
  handleRequest = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, GoToNextStateHandler.type);
  }
}