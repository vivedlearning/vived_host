import { makeAppObjectRepo } from "@vived/core";
import { MockHostDispatchEntity } from "../Mocks";

import {
  makeDispatchDisposeAppUC,
  DispatchDisposeAppUC
} from "./DispatchDisposeAppUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchDisposeAppUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch Dispose App", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchDisposeAppUC.get(uc.appObject)).toEqual(uc);
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

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchDisposeAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchDisposeAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchDisposeAppUC.getByID(uc.appObject.id, appObjects)).toEqual(
      uc
    );
  });
});
