import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  ChallengeResponse,
  HostStateEntity,
  makeHostStateEntity,
  makeHostStateMachine
} from "../Entities";
import { DuplicateStateUC, makeDuplicateStateUC } from "./DuplicateStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("StateMachine");
  const stateMachine = makeHostStateMachine(ao);

  const state = makeHostStateEntity(appObjects.getOrCreate("state1"));
  state.appID = "anApp";
  state.assets = ["asset1"];
  state.name = "State 1";
  state.expectedResponse = ChallengeResponse.PROGRESS;
  state.setStateData({ foo: "bar" });

  stateMachine.setStates([state]);
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

    const duplicatedID = stateMachine.states[1];
    const copiedState = stateMachine.getStateByID(duplicatedID);
    expect(copiedState).not.toBeUndefined();

    expect(copiedState?.id).not.toEqual("state1");
    expect(copiedState?.stateData).toEqual({ foo: "bar" });
    expect(copiedState?.name).toEqual("State 1 Copy");
    expect(copiedState?.appID).toEqual("anApp");
    expect(copiedState?.assets).toEqual(["asset1"]);
    expect(copiedState?.expectedResponse).toEqual(ChallengeResponse.PROGRESS);
  });

  it("Logs an warning if a bad state is passed in", () => {
    const { uc } = makeTestRig();

    const mockLog = jest.fn();
    uc.warn = mockLog;

    uc.duplicateState("unknownState");

    expect(mockLog).toBeCalled();
  });
});
