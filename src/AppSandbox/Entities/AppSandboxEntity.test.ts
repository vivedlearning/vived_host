import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity, SandboxState } from "./AppSandboxEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const observer = jest.fn();

  sandbox.addChangeObserver(observer);

  return { sandbox, observer };
}

describe("App Sandbox Entity", () => {
  it("App ID is the App Object ID", () => {
    const { sandbox } = makeTestRig();
    expect(sandbox.appID).toEqual("Sandbox");
  });

  it("Notifies if there is a change in the Start in zSpace flag", () => {
    const { sandbox, observer } = makeTestRig();

    sandbox.startInZSpace = true;

    expect(observer).toBeCalled();
    expect(sandbox.startInZSpace).toEqual(true);

    observer.mockClear();

    sandbox.startInZSpace = true;
    sandbox.startInZSpace = true;
    sandbox.startInZSpace = true;

    expect(observer).not.toBeCalled();
  });

  it("Notifies if the enable dev features flag changes", () => {
    const { sandbox, observer } = makeTestRig();

    sandbox.enableDevFeatures = false;

    expect(observer).toBeCalled();
    expect(sandbox.enableDevFeatures).toEqual(false);

    observer.mockClear();

    sandbox.enableDevFeatures = false;
    sandbox.enableDevFeatures = false;
    sandbox.enableDevFeatures = false;

    expect(observer).not.toBeCalled();
  });

  it("Notifies if the show inspector flag changes", () => {
    const { sandbox, observer } = makeTestRig();

    sandbox.showBabylonInspector = true;

    expect(observer).toBeCalled();
    expect(sandbox.showBabylonInspector).toEqual(true);

    observer.mockClear();

    sandbox.showBabylonInspector = true;
    sandbox.showBabylonInspector = true;
    sandbox.showBabylonInspector = true;

    expect(observer).not.toBeCalled();
  });

  it("Notifies when the player container is set", () => {
    const { sandbox, observer } = makeTestRig();

    sandbox.appContainer = document.createElement("div");

    expect(observer).toBeCalled();
  });

  it("Notifies when the player container is cleared", () => {
    const { sandbox, observer } = makeTestRig();

    sandbox.appContainer = document.createElement("div");
    observer.mockClear();

    sandbox.appContainer = undefined;
    expect(observer).toBeCalled();
  });

  it("Only notifies if something changes when setting or clearing the container", () => {
    const { sandbox, observer } = makeTestRig();

    const div = document.createElement("div");
    sandbox.appContainer = div;
    observer.mockClear();

    sandbox.appContainer = div;
    sandbox.appContainer = div;
    sandbox.appContainer = div;

    expect(observer).not.toBeCalled();

    sandbox.appContainer = undefined;
    observer.mockClear();

    sandbox.appContainer = undefined;
    sandbox.appContainer = undefined;
    sandbox.appContainer = undefined;

    expect(observer).not.toBeCalled();
  });

  it("Notifies when the state changes", () => {
    const { sandbox, observer } = makeTestRig();

    expect(sandbox.state).toEqual(SandboxState.UNMOUNTED);
    observer.mockClear();

    sandbox.state = SandboxState.PLAYING;
    expect(observer).toBeCalled();

    observer.mockClear();

    sandbox.state = SandboxState.PLAYING;
    sandbox.state = SandboxState.PLAYING;
    sandbox.state = SandboxState.PLAYING;

    expect(observer).not.toBeCalled();
  });
});
