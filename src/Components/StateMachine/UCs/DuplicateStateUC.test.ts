import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateMachine } from "../Entities";
import { DuplicateStateUC, makeDuplicateStateUC } from "./DuplicateStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("StateMachine");
  const stateMachine = makeHostStateMachine(ao);

  stateMachine.setStates([
    {
      id: "state1",
      data: { state: "state 1 data" },
      name: "State 1",
      assets: []
    }
  ]);
  stateMachine.setActiveStateByID("state1");

  const uc = makeDuplicateStateUC(ao);

  return {
    stateMachine,
    uc,
    appObjects,
    registerSingletonSpy
  };
}

describe("Duplicate State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(DuplicateStateUC.get(appObjects)).toEqual(uc);
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });

  it("Adds a new state to the state list", () => {
    const { stateMachine, uc } = makeTestRig();

    expect(stateMachine.states).toHaveLength(1);

    uc.duplicateState("state1");

    expect(stateMachine.states).toHaveLength(2);
  });

  it("Copies the state parameters as expected", () => {
    const { stateMachine, uc } = makeTestRig();

    uc.duplicateState("state1");

    const copiedState = stateMachine.states[1];
    expect(copiedState.data).toEqual({ state: "state 1 data" });
    expect(copiedState.name).toEqual("State 1 Copy");
    expect(copiedState.id).not.toEqual("state1");
  });

  it("Logs an warning if a bad state is passed in", () => {
    const { uc } = makeTestRig();

    const mockLog = jest.fn();
    uc.warn = mockLog;

    uc.duplicateState("unknownState");

    expect(mockLog).toBeCalled();
  });
});
