import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockHostDispatchEntity } from "../Mocks";
import {
  DispatchShowBabylonInspectorUC, makeDispatchShowBabylonInspectorUC
} from "./DispatchShowBabylonInspectorUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchShowBabylonInspectorUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch show babylon inspector", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchShowBabylonInspectorUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "SHOW_BABYLON_INSPECTOR"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Dispatches the show flag", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(true);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ showBabylonInspector: true });
  });
  it("Dispatches the hide flag", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch(false);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ showBabylonInspector: false });
  });
});
