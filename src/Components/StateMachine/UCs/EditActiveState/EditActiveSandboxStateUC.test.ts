import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity } from "../../../AppSandbox";
import {
  MockDispatchIsAuthoringUC,
  MockDispatchSetStateUC
} from "../../../Dispatcher";
import { makeHostStateMachine } from "../../Entities";
import {
  makeMockHostEditingStateEntity,
  makeMockHostStateEntity
} from "../../Mocks";
import { makeEditActiveSandboxStateUC } from "./EditActiveSandboxStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchSetAuthoring = new MockDispatchIsAuthoringUC(sandboxAO);
  const mockDispatchSetState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const state1Entity = makeMockHostStateEntity("state1", appObjects);
  stateMachine.setStates([state1Entity]);
  stateMachine.setActiveStateByID("state1");
  const editingState = makeMockHostEditingStateEntity(appObjects);

  const uc = makeEditActiveSandboxStateUC(
    appObjects.getOrCreate("StateMachine")
  );

  return {
    sandbox,
    uc,
    mockDispatchSetAuthoring,
    mockDispatchSetState,
    appObjects,
    registerSingletonSpy,
    stateMachine,
    editingState,
    state1Entity
  };
}

describe("Edit Active State UC", () => {
  it("Dispatches the state to the app", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.editActiveState();

    const expectedStateStr = JSON.stringify({ foo: "bar" });
    expect(mockDispatchSetState.doDispatch).toBeCalledWith(expectedStateStr);
  });

  it("Dispatches the authoring flag to the app", () => {
    const { uc, mockDispatchSetAuthoring } = makeTestRig();

    uc.editActiveState();

    expect(mockDispatchSetAuthoring.doDispatch).toBeCalledWith(true);
  });

  it("Start editing the state", () => {
    const { uc, editingState, state1Entity } = makeTestRig();

    uc.editActiveState();

    expect(editingState.startEditing).toBeCalledWith(state1Entity);
  });

  it("Logs an error if there is no dispatch authoring", () => {
    const { uc, mockDispatchSetAuthoring, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); //Suppresses the warning from getSingleton

    mockDispatchSetAuthoring.dispose();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Logs an error if there is no dispatch state", () => {
    const { uc, mockDispatchSetState, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); //Suppresses the warning from getSingleton

    mockDispatchSetState.dispose();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Warns if there is no active slide", () => {
    const { uc, stateMachine, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); //Suppresses the warning from getSingleton

    stateMachine.clearActiveState();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
