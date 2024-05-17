import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { Handler } from "../../../Types";
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

export function makeMockHostDispatchEntity(appObjects: HostAppObjectRepo) {
  return new MockHostDispatchEntity(
    appObjects.getOrCreate("MockHostDispatchEntity")
  );
}
