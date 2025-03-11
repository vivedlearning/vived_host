import { AppObject } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export class MockHostDispatchEntity extends HostDispatchEntity {
  clearAppHandler = jest.fn();
  appHandlerVersion = 1;
  getRequestPayloadVersion = jest.fn();
  registerAppHandler = jest.fn();
  dispatch = jest.fn();
  formRequestAndDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, HostDispatchEntity.type);
  }
}
