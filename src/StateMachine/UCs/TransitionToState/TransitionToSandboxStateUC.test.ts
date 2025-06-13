import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../../../AppSandbox/Entities";
import { DispatchStateDTO, MockDispatchSetStateUC } from "../../../Dispatcher";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostStateEntity } from "../../Mocks";
import { makeTransitionToSandboxStateUC } from "./TransitionToSandboxStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchSetState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([
    makeMockHostStateEntity("state1", appObjects),
    makeMockHostStateEntity("state2", appObjects)
  ]);

  stateMachine.transitionDuration = 3;

  const uc = makeTransitionToSandboxStateUC(
    appObjects.getOrCreate("StateMachine")
  );

  return {
    sandbox,
    uc,
    mockDispatchSetState,
    registerSingletonSpy,
    appObjects,
    stateMachine
  };
}

describe("Transition to Sandbox State UC", () => {
  it("Sets the active state", () => {
    const { stateMachine, uc } = makeTestRig();

    expect(stateMachine.activeState).toBeUndefined();

    uc.transitionToState("state1");

    expect(stateMachine.activeState).toEqual("state1");
  });

  it("Warns if it cannot find the state", () => {
    const { uc } = makeTestRig();

    const mockLog = jest.fn();
    uc.warn = mockLog;

    uc.transitionToState("unknownStateID");

    expect(mockLog).toBeCalled();
  });

  it("Logs an error if there is not a set state dispatcher", () => {
    const { uc, mockDispatchSetState, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); // Suppresses the warning from getSingleton

    mockDispatchSetState.dispose();

    uc.transitionToState("state1");

    expect(mockLog).toBeCalled();
  });

  it("Passes the object state", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.finalState).toEqual({ foo: "bar" });
  });

  it("Passes state machine duration", () => {
    const { uc, mockDispatchSetState, stateMachine } = makeTestRig();

    stateMachine.transitionDuration = 4;

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.duration).toEqual(4);
  });

  it("Passes has next state as true", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(true);
  });

  it("Passes has next state as false if there isn't a next state", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state2");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(false);
  });

  it("Passes has previous state as false if there isn't a previous state", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(false);
  });

  it("Passes has previous state as true if there is a previous state", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state2");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(true);
  });

  it("Passes hide nav as false if there there are at least two states", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(false);
  });

  it("Passes hide nav as true if there there are less than two states", () => {
    const { uc, mockDispatchSetState, appObjects, stateMachine } =
      makeTestRig();

    stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

    uc.transitionToState("state1");

    const dispatchDTO = mockDispatchSetState.doDispatch.mock
      .calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(true);
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
