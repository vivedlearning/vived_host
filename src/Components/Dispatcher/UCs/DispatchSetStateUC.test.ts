import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  makeDispatchSetStateUC,
  DispatchSetStateUC
} from "./DispatchSetStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockDispatcher = makeMockHostDispatchEntity(appObjects);

  const uc = makeDispatchSetStateUC(mockDispatcher.appObject);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch is authoring", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchSetStateUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("some state");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "SET_APP_STATE"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("some state");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });

  it("Dispatches the state string", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("some state");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ finalState: "some state" });
  });

  it("Dispatches duration", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("some state", 3);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ finalState: "some state", duration: 3 });
  });
});
