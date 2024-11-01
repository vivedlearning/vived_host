import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity } from "../../../AppSandbox";
import { MockDispatchSetStateUC } from "../../../Dispatcher";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostStateEntity } from "../../Mocks";
import { makeTransitionToSandboxStateUC } from "./TransitionToSandboxStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchSetState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

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
    appObjects.submitWarning = jest.fn(); //Suppresses the warning from getSingleton

    mockDispatchSetState.dispose();

    uc.transitionToState("state1");

    expect(mockLog).toBeCalled();
  });

  it("Dispatches the state and transition duration", () => {
    const { uc, mockDispatchSetState } = makeTestRig();

    uc.transitionToState("state1");

    const expectedStateStr = JSON.stringify({ foo: "bar" });
    expect(mockDispatchSetState.doDispatch).toBeCalledWith(expectedStateStr, 3);
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
