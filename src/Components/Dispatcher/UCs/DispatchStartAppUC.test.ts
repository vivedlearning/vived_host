import { makeAppObjectRepo } from "@vived/core";
import { MockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  DispatchStartAppUC,
  makeDispatchStartAppUC
} from "./DispatchStartAppUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);
  const element = document.createElement("div");

  const uc = makeDispatchStartAppUC(ao);

  return { uc, appObjects, mockDispatcher, element };
}

describe("Dispatch Start App", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchStartAppUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher, element } = makeTestRig();

    uc.doDispatch(element);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "START_APP"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher, element } = makeTestRig();

    uc.doDispatch(element);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(2);
  });

  it("Dispatches the html element", () => {
    const { uc, mockDispatcher, element } = makeTestRig();

    uc.doDispatch(element);

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ container: element });
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchStartAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchStartAppUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchStartAppUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});
