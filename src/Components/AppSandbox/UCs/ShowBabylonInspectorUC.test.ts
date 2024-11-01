import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockDispatchShowBabylonInspectorUC } from "../../Dispatcher";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { makeShowBabylonInspectorUC } from "./ShowBabylonInspectorUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  sandbox.showBabylonInspector = false;
  const ao = appObjects.getOrCreate("AppID");
  const mockDispatch = new MockDispatchShowBabylonInspectorUC(ao);
  const uc = makeShowBabylonInspectorUC(ao);

  return { sandbox, mockDispatch, uc };
}

describe("Show Babylon Inspector UC", () => {
  it("Toggles the flag", () => {
    const { sandbox, uc } = makeTestRig();

    expect(sandbox.showBabylonInspector).toEqual(false);

    uc.toggleShow();

    expect(sandbox.showBabylonInspector).toEqual(true);

    uc.toggleShow();

    expect(sandbox.showBabylonInspector).toEqual(false);
  });

  it("Dispatches to the App", () => {
    const { uc, mockDispatch, sandbox } = makeTestRig();

    expect(sandbox.showBabylonInspector).toEqual(false);

    uc.toggleShow();

    expect(mockDispatch.doDispatch).toBeCalledWith(true);

    uc.toggleShow();

    expect(mockDispatch.doDispatch).toBeCalledWith(false);
  });

  it("Hides the inspector", () => {
    const { uc, mockDispatch, sandbox } = makeTestRig();

    sandbox.showBabylonInspector = true;
    uc.hide();

    expect(mockDispatch.doDispatch).toBeCalledWith(false);
    expect(sandbox.showBabylonInspector).toEqual(false);
  });
});
