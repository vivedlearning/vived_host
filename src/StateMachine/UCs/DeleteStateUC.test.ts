import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateEntity, makeHostStateMachine } from "../Entities";
import { DeleteStateUC, makeDeleteStateUC } from "./DeleteStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("StateMachine");
  const stateMachine = makeHostStateMachine(ao);

  const state = makeHostStateEntity(appObjects.getOrCreate("state1"));
  stateMachine.setStates([state]);
  stateMachine.setActiveStateByID("state1");

  const uc = makeDeleteStateUC(ao);

  return {
    stateMachine,
    uc,
    appObjects,
    registerSingletonSpy
  };
}

describe("Delete State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(DeleteStateUC.get(appObjects)).toEqual(uc);
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });

  it("Deletes the state", () => {
    const { uc, stateMachine } = makeTestRig();

    expect(stateMachine.hasState("state1")).toEqual(true);

    uc.deleteState("state1");

    expect(stateMachine.hasState("state1")).toEqual(false);
  });

  it("Logs an warning if a bad state is passed in", () => {
    const { uc } = makeTestRig();

    const mockLog = jest.fn();
    uc.warn = mockLog;

    uc.deleteState("unknownState");

    expect(mockLog).toBeCalled();
  });
});
