import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  makeDispatchStartAppUC,
  DispatchStartAppUC
} from "./DispatchStartAppUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockDispatcher = makeMockHostDispatchEntity(appObjects);

  const uc = makeDispatchStartAppUC(mockDispatcher.appObject);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch Start App", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchStartAppUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "START_APP"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });
});
