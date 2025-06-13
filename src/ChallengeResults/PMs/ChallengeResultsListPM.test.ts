import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import {
  makeHostStateEntity,
  ChallengeResponse
} from "../../StateMachine/Entities/HostStateEntity";
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

  // Create a state we can use for testing
  const state1 = makeHostStateEntity(appObjects.getOrCreate("state1"));
  state1.name = "State Name";

  stateMachine.setStates([state1]);

  const pm = makeChallengeResultsPM(appObjects.getOrCreate("PM"));

  return {
    pm,
    results,
    appObjects,
    registerSingletonSpy,
    state1,
    stateMachine
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
    slideName: "slide name",
    stateIndex: 0
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
        slideName: "State Name",
        stateIndex: 0
      }
    ]);
  });

  it("Includes states with expected responses even without results", () => {
    const { pm, state1, results, stateMachine } = makeTestRig();

    // Set expected response on state1
    state1.expectedResponse = ChallengeResponse.HIT;
    stateMachine.notifyOnChange();

    // VM should include the state with expected response
    expect(pm.lastVM?.length).toBe(1);
    expect(pm.lastVM?.[0].id).toBe(state1.id);
    expect(pm.lastVM?.[0].slideName).toBe("State Name");
    expect(pm.lastVM?.[0].attempts).toBe(0);
    expect(pm.lastVM?.[0].resultType).toBeUndefined();
    expect(pm.lastVM?.[0].resultData).toBeUndefined();

    // Now add an actual result
    results.submitHitResult(state1.id, true, 1, "Success!");

    // VM should update with result data
    expect(pm.lastVM?.length).toBe(1);
    expect(pm.lastVM?.[0].attempts).toBe(1);
    expect(pm.lastVM?.[0].resultType).toBe("HIT");
    expect(pm.lastVM?.[0].resultData).toBeDefined();
  });

  it("Doesn't include states with NONE expected responses and no results", () => {
    const { pm, state1 } = makeTestRig();

    // Set NONE expected response
    state1.expectedResponse = ChallengeResponse.NONE;

    // VM should not include any states
    expect(pm.lastVM?.length).toBe(0);
  });

  it("Doesn't include states with undefined expected responses and no results", () => {
    const { pm, state1 } = makeTestRig();

    // Make sure expected response is undefined
    state1.expectedResponse = undefined;

    // VM should not include any states
    expect(pm.lastVM?.length).toBe(0);
  });

  it("Updates when state expected responses change", () => {
    const { pm, state1, stateMachine } = makeTestRig();

    // Initially no states in VM (undefined expected response)
    expect(pm.lastVM?.length).toBe(0);

    // Set expected response
    state1.expectedResponse = ChallengeResponse.SCORE;
    stateMachine.notifyOnChange();

    // VM should now include state1
    expect(pm.lastVM?.length).toBe(1);
    expect(pm.lastVM?.[0].id).toBe(state1.id);

    // Change to NONE should remove from VM
    state1.expectedResponse = ChallengeResponse.NONE;
    stateMachine.notifyOnChange();

    expect(pm.lastVM?.length).toBe(0);
  });
});
