import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  MockHostDispatchEntity
} from "../Mocks/MockHostDispatcher";
import {
  DispatchStopZSpaceUC, makeDispatchStopZSpaceUC
} from "./DispatchStopZSpaceUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchStopZSpaceUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch Stop App", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchStopZSpaceUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "STOP_ZSPACE"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });
});
