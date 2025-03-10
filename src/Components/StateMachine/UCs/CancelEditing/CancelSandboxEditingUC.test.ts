import { makeAppObjectRepo } from "@vived/core";
import {
  makeAppSandboxEntity,
  SandboxState
} from "../../../AppSandbox/Entities";
import { DispatchStateDTO } from "../../../Dispatcher";
import {
  MockDispatchIsAuthoringUC,
  MockDispatchSetStateUC
} from "../../../Dispatcher/Mocks";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostEditingStateEntity } from "../../Mocks/MockHostEditingStateEntity";
import { makeMockHostStateEntity } from "../../Mocks/MockHostStateEntity";
import { makeCancelSandboxEditingUC } from "./CancelSandboxEditingUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("app1");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchIsAuthoring = new MockDispatchIsAuthoringUC(sandboxAO);
  const mockDispatchState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([
    makeMockHostStateEntity("state1", appObjects),
    makeMockHostStateEntity("state2", appObjects)
  ]);

  const editingState = makeMockHostEditingStateEntity(appObjects);

  const uc = makeCancelSandboxEditingUC(appObjects.getOrCreate("AO"));

  return {
    sandbox,
    uc,
    mockDispatchIsAuthoring,
    mockDispatchState,
    stateMachine,
    editingState,
    registerSingletonSpy,
    appObjects
  };
}

describe("Cancel Sandbox Authoring UC", () => {
  it("Calls Cancel Editing", () => {
    const { editingState, uc } = makeTestRig();

    uc.cancel();

    expect(editingState.cancelEditState).toBeCalled();
  });

  it("Dispatches authoring as false to the app", () => {
    const { uc, mockDispatchIsAuthoring } = makeTestRig();
    uc.cancel();

    expect(mockDispatchIsAuthoring.doDispatch).toBeCalledWith(false);
  });

  it("Dispatches the original state to the app if a state was selected", () => {
    const { stateMachine, uc, mockDispatchState } = makeTestRig();
    stateMachine.setActiveStateByID("state1");
    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.finalState).toEqual({ foo: "bar" });
  });

  it("Does not send a duration", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.duration).toBeUndefined();
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(true);
  });

  it("Sends false if there is not a previous slide", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(false);
  });

  it("Sends false if there is not a next slide", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(false);
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(true);
  });

  it("Sends false for has hide nav if there are at least two slides", () => {
    const { stateMachine, mockDispatchState, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(false);
  });

  it("Sends true for has hide nav of there are less than 2 slides", () => {
    const { stateMachine, mockDispatchState, uc, appObjects } = makeTestRig();
    stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

    stateMachine.setActiveStateByID("state1");

    uc.cancel();

    const dispatchDTO = mockDispatchState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(true);
  });

  it("Puts the state back to mounted if there is no active state", () => {
    const { sandbox, uc } = makeTestRig();

    sandbox.state = SandboxState.PLAYING;

    uc.cancel();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
