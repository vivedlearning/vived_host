import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  MockHostDispatchEntity
} from "../Mocks/MockHostDispatcher";
import { DispatchThemeUC, makeDispatchThemeUC } from "./DispatchThemeUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const uc = makeDispatchThemeUC(ao);

  return { uc, appObjects, mockDispatcher };
}

describe("Dispatch is authoring", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchThemeUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch({ some: "colors" });

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "SET_THEME_COLORS"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch({ some: "colors" });

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Dispatches the payload", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch({ some: "colors" });

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    expect(payload).toEqual({ colors: { some: "colors" } });
  });
});
