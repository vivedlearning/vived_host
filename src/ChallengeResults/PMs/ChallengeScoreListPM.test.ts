import { makeAppObjectRepo } from "@vived/core";
import {
  ChallengeResponse,
  makeHostStateEntity
} from "../../StateMachine/Entities/HostStateEntity";
import { makeHostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import { makeChallengeResults } from "../Entities";
import {
  ChallengeScoreListPM,
  makeChallengeScoreListPM,
  SlideScoreVM
} from "./ChallengeScoreListPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  // Create the challenge results entity
  const results = makeChallengeResults(
    appObjects.getOrCreate("ChallengeResults")
  );

  // Create the state machine
  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  // Create states
  const state1 = makeHostStateEntity(appObjects.getOrCreate("state1"));
  state1.name = "First Slide";

  const state2 = makeHostStateEntity(appObjects.getOrCreate("state2"));
  state2.name = "Second Slide";

  // Add states to state machine
  stateMachine.setStates([state1, state2]);

  // Create the PM
  const pm = makeChallengeScoreListPM(appObjects.getOrCreate("PM"));

  return {
    appObjects,
    results,
    stateMachine,
    pm,
    state1,
    state2,
    registerSingletonSpy
  };
}

describe("ChallengeScoreListPM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();
    expect(ChallengeScoreListPM.get(appObjects)).toEqual(pm);
  });

  it("Registers as the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initializes with empty list", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).toEqual([]);
  });

  it("Creates view model for each state", () => {
    const { pm, results, state1, state2 } = makeTestRig();

    // Submit results for the first slide
    results.submitHitResult(state1.id, true, 1, "Great job!");

    // Submit results for the second slide
    results.submitScoreResult(state2.id, 80, 100, 1, "Good work!");

    // Check that we have view models for both slides
    expect(pm.lastVM?.length).toBe(2);

    // Check first slide
    expect(pm.lastVM?.[0].id).toBe(state1.id);
    expect(pm.lastVM?.[0].displayName).toBe("Slide 1: First Slide");
    expect(pm.lastVM?.[0].score).toBe(1); // HIT success is 1

    // Check second slide
    expect(pm.lastVM?.[1].id).toBe(state2.id);
    expect(pm.lastVM?.[1].displayName).toBe("Slide 2: Second Slide");
    expect(pm.lastVM?.[1].score).toBe(0.8); // 80/100 = 0.8
  });

  it("Updates when challenge results change", () => {
    const { pm, results, state1 } = makeTestRig();

    // First submit a failing result
    results.submitHitResult(state1.id, false, 1, "Try again!");
    expect(pm.lastVM?.[0].score).toBe(0);

    // Update to a passing result
    results.submitHitResult(state1.id, true, 2, "Great job!");
    expect(pm.lastVM?.[0].score).toBe(1);
  });

  it("Returns true when comparing identical view models", () => {
    const { pm } = makeTestRig();

    const vm1: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    const vm2: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(true);
  });

  it("Returns false when comparing different view models by id", () => {
    const { pm } = makeTestRig();

    const vm1: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    const vm2: SlideScoreVM[] = [
      { id: "3", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("Returns false when comparing different view models by display name", () => {
    const { pm } = makeTestRig();

    const vm1: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    const vm2: SlideScoreVM[] = [
      { id: "1", displayName: "Slide One", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("Returns false when comparing different view models by score", () => {
    const { pm } = makeTestRig();

    const vm1: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    const vm2: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.6 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("Returns false when comparing arrays of different lengths", () => {
    const { pm } = makeTestRig();

    const vm1: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 },
      { id: "2", displayName: "Slide 2", score: 0.8 }
    ];

    const vm2: SlideScoreVM[] = [
      { id: "1", displayName: "Slide 1", score: 0.5 }
    ];

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("Includes states with expected responses even without results", () => {
    const { pm, state1, stateMachine } = makeTestRig();

    // No results submitted, but set expected response on state1
    state1.expectedResponse = ChallengeResponse.HIT;
    stateMachine.notifyOnChange();

    // Check VM includes the state with expected response
    expect(pm.lastVM?.length).toBe(1);
    expect(pm.lastVM?.[0].id).toBe(state1.id);
    expect(pm.lastVM?.[0].displayName).toBe("Slide 1: First Slide");
  });

  it("Doesn't include states with NONE expected responses and no results", () => {
    const { pm, state1, state2, stateMachine } = makeTestRig();

    // Set NONE expected response on state1
    state1.expectedResponse = ChallengeResponse.NONE;
    // Set undefined expected response on state2
    state2.expectedResponse = undefined;
    stateMachine.notifyOnChange();

    // VM should not include any states
    expect(pm.lastVM?.length).toBe(0);
  });

  it("Updates when state expected responses change", () => {
    const { pm, state1, stateMachine } = makeTestRig();

    // Initially no states in VM
    expect(pm.lastVM?.length).toBe(0);

    // Set expected response on state1
    state1.expectedResponse = ChallengeResponse.SCORE;
    stateMachine.notifyOnChange();

    // VM should now include state1
    expect(pm.lastVM?.length).toBe(1);
    expect(pm.lastVM?.[0].id).toBe(state1.id);
  });
});
