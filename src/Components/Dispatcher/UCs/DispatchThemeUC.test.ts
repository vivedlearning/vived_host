import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { defaultScheme, makeHostThemeEntity } from "../../ThemeColors";
import { MockHostDispatchEntity } from "../Mocks/MockHostDispatcher";
import {
  DispatchThemeUC,
  makeDispatchThemeUC,
  ColorSchemeV1
} from "./DispatchThemeUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const mockDispatcher = new MockHostDispatchEntity(ao);

  const theme = makeHostThemeEntity(appObjects.getOrCreate("theme"));

  const uc = makeDispatchThemeUC(ao);

  return { uc, appObjects, mockDispatcher, theme };
}

describe("Dispatch is authoring", () => {
  it("Gets the UC", () => {
    const { uc } = makeTestRig();

    expect(DispatchThemeUC.get(uc.appObject)).toEqual(uc);
  });

  it("Dispatches the correct type", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][0]).toEqual(
      "SET_THEME_COLORS"
    );
  });

  it("Dispatches the correct version", () => {
    const { uc, mockDispatcher } = makeTestRig();

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    expect(mockDispatcher.formRequestAndDispatch.mock.calls[0][1]).toEqual(1);
  });

  it("Dispatches the payload", () => {
    const { uc, mockDispatcher, theme } = makeTestRig();

    const scheme = { ...defaultScheme, primary: "#123456" };
    theme.submitScheme("myScheme", scheme);
    theme.activeSchemeName = "myScheme";

    uc.doDispatch();

    expect(mockDispatcher.formRequestAndDispatch).toBeCalledTimes(1);
    const payload = mockDispatcher.formRequestAndDispatch.mock.calls[0][2];

    const colors = payload.colors as ColorSchemeV1;

    expect(colors.primary).toEqual("#123456");
  });

  it("Warns if it cannot find the app object when getting by ID", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DispatchThemeUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if that App Object does not have the UC", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someID");
    appObjects.submitWarning = jest.fn();

    DispatchThemeUC.getByID("someID", appObjects);
    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets by ID", () => {
    const { appObjects, uc } = makeTestRig();

    expect(DispatchThemeUC.getByID(uc.appObject.id, appObjects)).toEqual(uc);
  });
});
