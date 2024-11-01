import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../AppSandbox";
import { MockDispatchStartZSpaceUC } from "../../Dispatcher";
import { makeZSpaceHostEntity } from "../Entities";
import { makeMockStopZSpaceUC } from "../Mocks";
import { makeStartSandboxZSpaceUC } from "./StartSandboxZSpaceUC";
import {MockXRSession} from "../Mocks/MockXRSession"

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatcher = new MockDispatchStartZSpaceUC(sandboxAO);

  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zSpace"));

  const uc = makeStartSandboxZSpaceUC(appObjects.getOrCreate("zSpace"));
  const startZSpace = uc.startZSpace;

  zSpace.isSupported = true;
  zSpace.emulate = false;

  const mockRequestSession = jest.fn();

  (navigator as any).xr = {
    requestSession: mockRequestSession
  };

  const mockSession = new MockXRSession();
  mockRequestSession.mockResolvedValue(mockSession);

  const mockStop = makeMockStopZSpaceUC(appObjects);

  return {
    sandbox,
    uc,
    startZSpace,
    mockRequestSession,
    mockSession,
    registerSpy,
    appObjects,
    mockDispatcher,
    zSpace,
    mockStop
  };
}

describe("Start Sandbox ZSpace Use Case", () => {
  it("Registers as the singleton", () => {
    const { registerSpy, uc } = makeTestRig();

    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Sets the session if it resolves", async () => {
    const { zSpace, mockSession, startZSpace } = makeTestRig();

    expect(zSpace.session).toBeUndefined();

    await startZSpace();

    expect(zSpace.session).toEqual(mockSession);
  });

  it("Request an immersive-vr session", () => {
    const { mockRequestSession, startZSpace } = makeTestRig();

    startZSpace();

    expect(mockRequestSession).toBeCalledWith("immersive-vr");
  });

  it("Rejects and logs an error if the request rejects", async () => {
    const { mockRequestSession, startZSpace } = makeTestRig();
    mockRequestSession.mockRejectedValue(new Error("Some Error"));

    return expect(startZSpace).rejects.toEqual(new Error("Some Error"));
  });

  it("Hooks up the end event listener", async () => {
    const { mockSession, startZSpace, mockStop } = makeTestRig();
    await startZSpace();

    expect(mockSession.addEventListener).toBeCalledWith(
      "end",
      mockStop.stopZSpace,
      { once: true }
    );
  });

  it("Is set active", async () => {
    const { zSpace, startZSpace } = makeTestRig();

    expect(zSpace.isActive).toEqual(false);

    await startZSpace();

    expect(zSpace.isActive).toEqual(true);
  });

  it("Resolves immediately if active", async () => {
    const { zSpace, startZSpace, mockRequestSession } = makeTestRig();

    zSpace.isActive = true;

    await startZSpace();

    expect(mockRequestSession).not.toBeCalled();
  });

  it("Dispatches to the app if the sandbox is playing", async () => {
    const { sandbox, startZSpace, mockSession, mockDispatcher } = makeTestRig();

    sandbox.state = SandboxState.PLAYING;

    await startZSpace();

    expect(mockDispatcher.doDispatch).toBeCalledWith(mockSession, false);
  });

  it("Rejects if zSpace is not supported", async () => {
    const { zSpace, startZSpace } = makeTestRig();
    zSpace.isSupported = false;

    return expect(startZSpace).rejects.toEqual(
      new Error("ZSpace is not supported")
    );
  });

  it("Dispatches with the emulation flag", async () => {
    const { zSpace, startZSpace, sandbox, mockDispatcher } = makeTestRig();
    zSpace.isSupported = false;
    sandbox.state = SandboxState.PLAYING;
    zSpace.emulate = true;

    await startZSpace();

    expect(mockDispatcher.doDispatch).toBeCalledWith({}, true);
  });

  it("Is set active with the emulation flag", async () => {
    const { zSpace, startZSpace, sandbox } = makeTestRig();
    zSpace.isSupported = false;
    sandbox.state = SandboxState.PLAYING;
    zSpace.emulate = true;

    expect(zSpace.isActive).toEqual(false);

    await startZSpace();

    expect(zSpace.isActive).toEqual(true);
  });
});
