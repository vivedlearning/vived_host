import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateEntity } from "./HostStateEntity";
import { HostStateMachine, makeHostStateMachine } from "./HostStateMachine";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  const observer = jest.fn();
  stateMachine.addChangeObserver(observer);

  stateMachine.setStates([
    makeHostStateEntity(appObjects.getOrCreate("state1")),
    makeHostStateEntity(appObjects.getOrCreate("state2"))
  ]);

  return { stateMachine, observer, appObjects, registerSingletonSpy };
}

describe("State Machine", () => {
  it("Gets the singleton", () => {
    const { stateMachine, appObjects } = makeTestRig();

    expect(HostStateMachine.get(appObjects)).toEqual(stateMachine);
  });

  it("Register as the singleton", () => {
    const { stateMachine, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(stateMachine);
  });

  it("Allows states to be set", () => {
    const { stateMachine, observer } = makeTestRig();

    expect(stateMachine.states).toHaveLength(2);
    expect(observer).toBeCalled();
  });

  it("Creates a new state", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    const newState = stateMachine.createNewState();

    expect(newState.id).not.toBeFalsy();

    expect(stateMachine.states).toHaveLength(3);
    expect(stateMachine.states[2]).toEqual(newState.id);
    expect(observer).toBeCalled();
  });

  it("Retrieves a state", () => {
    const { stateMachine } = makeTestRig();
    const newState = stateMachine.createNewState();
    const retrievedStateResult = stateMachine.getStateByID(newState.id);

    expect(retrievedStateResult).toEqual(newState);
  });

  it("Returns undefined if an unknowns state is requested", () => {
    const { stateMachine } = makeTestRig();

    const retrievedStateResult = stateMachine.getStateByID("unknownID");
    expect(retrievedStateResult).toBeUndefined();
  });

  it("Deletes a state", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.deleteState("state1");

    expect(stateMachine.states).toHaveLength(1);
    expect(observer).toBeCalled();
  });

  it("Disposes the State's AO on delete", () => {
    const { stateMachine } = makeTestRig();

    const stateAO = stateMachine.getStateByID("state1")?.appObject;
    expect(stateAO).not.toBeUndefined();

    stateAO!.dispose = jest.fn();

    stateMachine.deleteState("state1");

    expect(stateAO!.dispose).toBeCalled();
  });

  it("Does not notify is a unknown state is deleted", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.deleteState("UnknownID");
    expect(observer).not.toBeCalled();
  });

  it("Gets an index for a state by id", () => {
    const { stateMachine } = makeTestRig();

    const indexResult = stateMachine.getStateIndex("state1");
    expect(indexResult).toEqual(0);
  });

  it("Notifies when the active state is set", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    expect(stateMachine.activeState).toBeUndefined();

    stateMachine.setActiveStateByID("state1");

    expect(stateMachine.activeState).toEqual("state1");
    expect(observer).toBeCalled();
  });

  it("Does not notify if the active state is unchanged", () => {
    const { stateMachine, observer } = makeTestRig();

    stateMachine.setActiveStateByID("state1");
    observer.mockClear();

    stateMachine.setActiveStateByID("state1");
    stateMachine.setActiveStateByID("state1");
    stateMachine.setActiveStateByID("state1");

    expect(observer).not.toBeCalled();
  });

  it("Notifies when the active state is cleared", () => {
    const { stateMachine, observer } = makeTestRig();
    stateMachine.setActiveStateByID("state1");
    observer.mockClear();

    stateMachine.clearActiveState();

    expect(stateMachine.activeState).toBeUndefined();
    expect(observer).toBeCalled();
  });

  it("Does not notify when the active state is cleared if there is no active state", () => {
    const { stateMachine, observer } = makeTestRig();

    observer.mockClear();

    stateMachine.clearActiveState();
    stateMachine.clearActiveState();
    stateMachine.clearActiveState();

    expect(observer).not.toBeCalled();
  });

  it("Sets previous state as expected", () => {
    const { stateMachine } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    expect(stateMachine.previousState).toBeUndefined();

    stateMachine.setActiveStateByID("state2");

    expect(stateMachine.previousState).toEqual("state1");

    stateMachine.clearActiveState();

    expect(stateMachine.previousState).toBeUndefined();
  });

  it("Sets next state as expected", () => {
    const { stateMachine } = makeTestRig();

    expect(stateMachine.nextState).toBeUndefined();

    stateMachine.setActiveStateByID("state1");

    expect(stateMachine.nextState).toEqual("state2");

    stateMachine.setActiveStateByID("state2");

    expect(stateMachine.nextState).toBeUndefined();
  });

  it("Has state", () => {
    const { stateMachine } = makeTestRig();
    expect(stateMachine.hasState("state1")).toEqual(true);
    expect(stateMachine.hasState("somethingElse")).toEqual(false);
  });

  it("Reports correct state count", () => {
    const { stateMachine } = makeTestRig();

    // Initial state has 2 states
    expect(stateMachine.stateCount).toEqual(2);

    // After adding a state
    stateMachine.createNewState();
    expect(stateMachine.stateCount).toEqual(3);

    // After deleting a state
    stateMachine.deleteState("state1");
    expect(stateMachine.stateCount).toEqual(2);
  });

  it("Sets active state by index", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.setActiveStateByIndex(1);

    expect(stateMachine.activeState).toEqual("state2");
    expect(observer).toBeCalled();
  });

  it("Does nothing if index is out of bounds", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    // With negative index
    stateMachine.setActiveStateByIndex(-1);
    expect(stateMachine.activeState).toBeUndefined();
    expect(observer).not.toBeCalled();

    // With too large index
    stateMachine.setActiveStateByIndex(5);
    expect(stateMachine.activeState).toBeUndefined();
    expect(observer).not.toBeCalled();
  });

  it("Sets previous and next state correctly when using setActiveStateByIndex", () => {
    const { stateMachine } = makeTestRig();
    stateMachine.createNewState(); // Now 3 states

    stateMachine.setActiveStateByIndex(1);

    expect(stateMachine.activeState).toEqual("state2");
    expect(stateMachine.previousState).toEqual("state1");
    expect(stateMachine.nextState).not.toBeUndefined();
  });

  it("Deletes all states", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.deleteAllStates();

    expect(stateMachine.states).toHaveLength(0);
    expect(stateMachine.stateCount).toEqual(0);
    expect(observer).toBeCalled();
  });

  it("Does not notify if there are no states to delete", () => {
    const { stateMachine, observer } = makeTestRig();

    stateMachine.deleteAllStates(); // Clear all states first
    observer.mockClear();

    stateMachine.deleteAllStates(); // Try again with empty states
    expect(observer).not.toBeCalled();
  });

  it("Disposes all state app objects when deleting all states", () => {
    const { stateMachine } = makeTestRig();

    // Create mock dispose functions for each state
    const state1 = stateMachine.getStateByID("state1");
    const state2 = stateMachine.getStateByID("state2");

    expect(state1).not.toBeUndefined();
    expect(state2).not.toBeUndefined();

    state1!.appObject.dispose = jest.fn();
    state2!.appObject.dispose = jest.fn();

    stateMachine.deleteAllStates();

    expect(state1!.appObject.dispose).toBeCalled();
    expect(state2!.appObject.dispose).toBeCalled();
  });

  it("Clears active state when deleting all states", () => {
    const { stateMachine } = makeTestRig();

    stateMachine.setActiveStateByID("state1");
    expect(stateMachine.activeState).toEqual("state1");

    stateMachine.deleteAllStates();

    expect(stateMachine.activeState).toBeUndefined();
    expect(stateMachine.previousState).toBeUndefined();
    expect(stateMachine.nextState).toBeUndefined();
  });

  it("Sets previous state active", () => {
    const { stateMachine, observer } = makeTestRig();

    // Set state2 as active so state1 becomes the previous state
    stateMachine.setActiveStateByID("state2");
    observer.mockClear();

    // Now call setPreviousStateActive
    stateMachine.setPreviousStateActive();

    expect(stateMachine.activeState).toEqual("state1");
    expect(observer).toBeCalled();
  });

  it("Does nothing when setting previous state active if there is no previous state", () => {
    const { stateMachine, observer } = makeTestRig();

    // Set state1 as active (which has no previous state)
    stateMachine.setActiveStateByID("state1");
    observer.mockClear();

    // Now call setPreviousStateActive
    stateMachine.setPreviousStateActive();

    // Should remain on state1
    expect(stateMachine.activeState).toEqual("state1");
    expect(observer).not.toHaveBeenCalled();
  });

  it("Sets next state active", () => {
    const { stateMachine, observer } = makeTestRig();

    // Set state1 as active so state2 becomes the next state
    stateMachine.setActiveStateByID("state1");
    observer.mockClear();

    // Now call setNextStateActive
    stateMachine.setNextStateActive();

    expect(stateMachine.activeState).toEqual("state2");
    expect(observer).toHaveBeenCalled();
  });

  it("Does nothing when setting next state active if there is no next state", () => {
    const { stateMachine, observer } = makeTestRig();

    // Set state2 as active (which has no next state)
    stateMachine.setActiveStateByID("state2");
    observer.mockClear();

    // Now call setNextStateActive
    stateMachine.setNextStateActive();

    // Should remain on state2
    expect(stateMachine.activeState).toEqual("state2");
    expect(observer).not.toHaveBeenCalled();
  });
});
