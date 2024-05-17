import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  makeDispatchStopZSpaceUC,
  DispatchStopZSpaceUC
} from "./DispatchStopZSpaceUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockDispatcher = makeMockHostDispatchEntity(appObjects);

  const uc = makeDispatchStopZSpaceUC(mockDispatcher.appObject);

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
