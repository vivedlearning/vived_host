import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  DispatchEnableFeatureUC,
  makeDispatchEnableFeatureUC
} from "./DispatchEnableFeatureUC";
import { MockHostDispatchEntity } from "../Mocks/MockHostDispatcher";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchEnableFeatureUC(ao);

  return { uc, appObjects, mockDispatcher};
}

describe("Dispatch Feature Flag", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchEnableFeatureUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("someFeature");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "ENABLE_FEATURE"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("someFeature");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Dispatches the expected payload", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch("someFeature");

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    const expectedPayload = {
      featureFlag: "someFeature"
    };

    expect(payload).toEqual(expectedPayload);
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchEnableFeatureUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchEnableFeatureUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(
      DispatchEnableFeatureUC.getByID(uc.appObject.id, appObjects)
    ).toEqual(uc);
  });
});
