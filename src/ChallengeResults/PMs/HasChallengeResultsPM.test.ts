import { makeAppObjectRepo } from "@vived/core";

import {
  HasChallengeResultsPM,
  makeHasChallengeResultsPM
} from "./HasChallengeResultsPM";
import { makeChallengeResults } from "../Entities";
import { makeHostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import {
  makeHostStateEntity,
  ChallengeResponse
} from "../../StateMachine/Entities/HostStateEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const results = makeChallengeResults(
    appObjects.getOrCreate("ChallengeResults")
  );

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const pm = makeHasChallengeResultsPM(appObjects.getOrCreate("PM"));

  return { appObjects, pm, registerSingletonSpy, results, stateMachine };
}

describe("HasChallengeResultsPM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(HasChallengeResultsPM.get(appObjects)).toEqual(pm);
  });

  it("Registers the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initialize with default VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).toBe(false);
  });

  it("when results change the VM is updated", () => {
    const { results, pm } = makeTestRig();

    results.submitHitResult("1", false, 0, "bob");

    expect(pm.lastVM).toBe(true);
  });

  it("when no results but a state has expectedResponse HIT, the VM is true", () => {
    const { stateMachine, pm } = makeTestRig();

    // Create a state with an expected response
    const state = makeHostStateEntity(
      stateMachine.appObjects.getOrCreate("state1")
    );
    state.expectedResponse = ChallengeResponse.HIT;

    // Add the state to the state machine
    stateMachine.setStates([state]);

    // The PM should detect this and set hasAssessmentResults to true
    expect(pm.lastVM).toBe(true);
  });

  it("when no results but a state has expectedResponse SCORE, the VM is true", () => {
    const { stateMachine, pm } = makeTestRig();

    // Create a state with an expected response
    const state = makeHostStateEntity(
      stateMachine.appObjects.getOrCreate("state1")
    );
    state.expectedResponse = ChallengeResponse.SCORE;

    // Add the state to the state machine
    stateMachine.setStates([state]);

    // The PM should detect this and set hasAssessmentResults to true
    expect(pm.lastVM).toBe(true);
  });

  it("when no results and states have NONE expectedResponse, the VM is false", () => {
    const { stateMachine, pm } = makeTestRig();

    // Create a state with an expected response of NONE
    const state = makeHostStateEntity(
      stateMachine.appObjects.getOrCreate("state1")
    );
    state.expectedResponse = ChallengeResponse.NONE;

    // Add the state to the state machine
    stateMachine.setStates([state]);

    // Since NONE is not considered a valid expected response, the VM should be false
    expect(pm.lastVM).toBe(false);
  });

  it("when no results and states have undefined expectedResponse, the VM is false", () => {
    const { stateMachine, pm } = makeTestRig();

    // Create a state with an undefined expected response
    const state = makeHostStateEntity(
      stateMachine.appObjects.getOrCreate("state1")
    );
    state.expectedResponse = undefined;

    // Add the state to the state machine
    stateMachine.setStates([state]);

    // Since the expected response is undefined, the VM should be false
    expect(pm.lastVM).toBe(false);
  });

  it("updating state expectedResponse from NONE to HIT changes VM to true", () => {
    const { stateMachine, pm } = makeTestRig();

    // Create a state with an expected response of NONE
    const state = makeHostStateEntity(
      stateMachine.appObjects.getOrCreate("state1")
    );
    state.expectedResponse = ChallengeResponse.NONE;

    // Add the state to the state machine
    stateMachine.setStates([state]);

    // VM should be false since response is NONE
    expect(pm.lastVM).toBe(false);

    // Change the expected response to HIT
    state.expectedResponse = ChallengeResponse.HIT;

    stateMachine.notifyOnChange(); // Notify the state machine of the change

    // VM should now be true
    expect(pm.lastVM).toBe(true);
  });
});
