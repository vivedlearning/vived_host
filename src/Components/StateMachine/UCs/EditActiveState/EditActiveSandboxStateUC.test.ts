import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../../../AppSandbox/Entities";
import { DispatchStateDTO } from "../../../Dispatcher";
import {
  MockDispatchIsAuthoringUC,
  MockDispatchSetStateUC
} from "../../../Dispatcher/Mocks";
import { makeHostStateMachine } from "../../Entities";
import {
  makeMockHostEditingStateEntity,
  makeMockHostStateEntity
} from "../../Mocks";
import { makeEditActiveSandboxStateUC } from "./EditActiveSandboxStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchSetAuthoring = new MockDispatchIsAuthoringUC(sandboxAO);
  const mockDispatchSetState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const state1 = makeMockHostStateEntity("state1", appObjects);
  const state2 = makeMockHostStateEntity("state2", appObjects);
  stateMachine.setStates([state1, state2]);
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
    state1
  };
}

describe("Edit Active State UC", () => {
  it("Dispatches the state to the app", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.finalState).toEqual({ foo: "bar" });
  });

  it("Does not send a duration", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.duration).toBeUndefined();
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(true);
  });

  it("Sends false if there is not a previous slide", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(false);
  });

  it("Sends false if there is not a next slide", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(false);
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(true);
  });

  it("Sends false for has hide nav if there are at least two slides", () => {
    const { stateMachine, mockDispatchSetState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(false);
  });

  it("Sends true for has hide nav of there are less than 2 slides", () => {
    const { stateMachine, mockDispatchSetState, uc, state1 } = makeTestRig();
    stateMachine.setStates([state1]);
    stateMachine.setActiveStateByID("state1");

    uc.editActiveState();

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(true);
  });

  it("Dispatches the authoring flag to the app", () => {
    const { uc, mockDispatchSetAuthoring } = makeTestRig();

    uc.editActiveState();

    expect(mockDispatchSetAuthoring.doDispatch).toBeCalledWith(true);
  });

  it("Start editing the state", () => {
    const { uc, editingState, state1 } = makeTestRig();

    uc.editActiveState();

    expect(editingState.startEditing).toBeCalledWith(state1);
  });

  it("Logs an error if there is no dispatch authoring", () => {
    const { uc, mockDispatchSetAuthoring, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); // Suppresses the warning from getSingleton

    mockDispatchSetAuthoring.dispose();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Logs an error if there is no dispatch state", () => {
    const { uc, mockDispatchSetState, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); // Suppresses the warning from getSingleton

    mockDispatchSetState.dispose();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Warns if there is no active slide", () => {
    const { uc, stateMachine, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); // Suppresses the warning from getSingleton

    stateMachine.clearActiveState();

    uc.editActiveState();

    expect(mockLog).toBeCalled();
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
