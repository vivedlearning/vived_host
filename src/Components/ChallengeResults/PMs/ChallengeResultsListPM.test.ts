import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateMachine } from "../../StateMachine/Entities";
import { makeMockHostStateEntity } from "../../StateMachine/Mocks/MockHostStateEntity";
import { makeChallengeResults } from "../Entities";
import {
  ChallengeResultsListPM,
  ChallengeResultVM,
  makeChallengeResultsPM
} from "./ChallengeResultsListPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const results = makeChallengeResults(appObjects.getOrCreate("Results"));

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

  const pm = makeChallengeResultsPM(appObjects.getOrCreate("PM"));

  return {
    pm,
    results,
    appObjects,
    registerSingletonSpy
  };
}

function makeChallengeResultVM(id: string): ChallengeResultVM {
  return {
    attempts: 1,
    id,
    message: "a message",
    resultData: {
      success: true
    },
    resultType: "HIT",
    slideName: "slide name"
  };
}

describe("Challenge Results PM", () => {
  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(ChallengeResultsListPM.get(appObjects)).toEqual(pm);
  });

  it("Registers the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const result1 = makeChallengeResultVM("result1");
    const result2 = makeChallengeResultVM("result2");

    const vm1 = [result1, result2];
    const vm2 = [...vm1];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a result to be removed", () => {
    const { pm } = makeTestRig();

    const result1 = makeChallengeResultVM("result1");
    const result2 = makeChallengeResultVM("result2");

    const vm1 = [result1, result2];
    const vm2 = [result1];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a result to be added", () => {
    const { pm } = makeTestRig();

    const result1 = makeChallengeResultVM("result1");
    const result2 = makeChallengeResultVM("result2");

    const vm1 = [result1, result2];

    const result3 = makeChallengeResultVM("result3");
    const vm2 = [result1, result2, result3];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for result ID to change", () => {
    const { pm } = makeTestRig();

    const result1 = makeChallengeResultVM("result1");
    const result2 = makeChallengeResultVM("result2");

    const vm1 = [result1, result2];

    const result2Again: ChallengeResultVM = { ...result2, id: "changed" };
    const vm2 = [result1, result2Again];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for tries to change", () => {
    const { pm } = makeTestRig();

    const result1 = makeChallengeResultVM("result1");
    const result2 = makeChallengeResultVM("result2");

    const vm1 = [result1, result2];

    const result2Again: ChallengeResultVM = { ...result2, attempts: 2 };
    const vm2 = [result1, result2Again];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Initializes the view", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates the results", () => {
    const { results, pm } = makeTestRig();

    results.submitHitResult("state1", false, 0, "bob");

    expect(pm.lastVM).toEqual([
      {
        attempts: 0,
        message: "bob",
        resultData: {
          success: false
        },
        resultType: "HIT",
        id: "state1",
        slideName: "State Name"
      }
    ]);
  });
});
