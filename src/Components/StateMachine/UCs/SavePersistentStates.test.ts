import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateEntity, makeHostStateMachine } from "../Entities";
import {
  makeSavePersistentStatesUC, SavePersistentStatesUC
} from "./SavePersistentStates";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("StateMachine");
  const stateMachine = makeHostStateMachine(ao);

  const state = makeHostStateEntity(appObjects.getOrCreate("state1"));
  stateMachine.setStates([state]);
  stateMachine.setActiveStateByID("state1");

  const uc = makeSavePersistentStatesUC(ao);

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

    expect(SavePersistentStatesUC.get(appObjects)).toEqual(uc);
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
