import { HostAppObject } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export class MockHostDispatchEntity extends HostDispatchEntity {
  appHandlerVersion = 1;
  getRequestPayloadVersion = jest.fn();
  registerAppHandler = jest.fn();
  dispatch = jest.fn();
  formRequestAndDispatch = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HostDispatchEntity.type);
  }
}
