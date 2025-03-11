import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../../../AppSandbox/Entities";
import { MockDispatchStopZSpaceUC } from "../../../Dispatcher/Mocks";
import { makeZSpaceHostEntity } from "../../Entities";
import { MockXRSession } from "../../Mocks";
import { makeStopSandboxZSpaceUC } from "./StopSandboxZSpaceUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("AppID");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatcher = new MockDispatchStopZSpaceUC(sandboxAO);

  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zSpace"));
  zSpace.isActive = true;

  const uc = makeStopSandboxZSpaceUC(appObjects.getOrCreate("zSpace"));
  const stopZSpace = uc.stopZSpace;

  const mockSession = new MockXRSession();

  const mockEndSession = jest.fn();
  mockSession.end = mockEndSession;

  zSpace.session = mockSession;

  return {
    sandbox,
    uc,
    stopZSpace,
    mockSession,
    registerSpy,
    mockDispatcher,
    appObjects,
    zSpace,
    mockEndSession
  };
}

describe("Stop Sandbox ZSpace Use Case", () => {
  it("Registers as the singleton", () => {
    const { registerSpy, uc } = makeTestRig();

    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Calls end on the session", () => {
    const { mockEndSession, stopZSpace } = makeTestRig();

    stopZSpace();
    expect(mockEndSession).toBeCalled();
  });

  it("Sets the session on the entity to undefined", () => {
    const { zSpace, stopZSpace } = makeTestRig();
    expect(zSpace.session).not.toBeUndefined();

    stopZSpace();

    expect(zSpace.session).toBeUndefined();
  });

  it("Removes the end event listener", () => {
    const { mockSession, stopZSpace } = makeTestRig();

    stopZSpace();
    expect(mockSession.removeEventListener).toBeCalledWith("end", stopZSpace);
  });

  it("Dispatches stop to the app", () => {
    const { stopZSpace, mockDispatcher } = makeTestRig();

    stopZSpace();

    expect(mockDispatcher.doDispatch).toBeCalled();
  });
});
