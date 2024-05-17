import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  makeDispatchDisposeAppUC,
  DispatchAppDispatcherUC
} from "./DispatchDisposeAppUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockDispatcher = makeMockHostDispatchEntity(appObjects);

  const uc = makeDispatchDisposeAppUC(mockDispatcher.appObject);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch Dispose App", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchAppDispatcherUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "DISPOSE_APP"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Dispatches the show flag", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toBeUndefined();
  });
});
