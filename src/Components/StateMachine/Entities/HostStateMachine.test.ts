import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { HostStateMachine, makeHostStateMachine, StateMachineState } from "./HostStateMachine";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  const observer = jest.fn();
  stateMachine.addChangeObserver(observer);

  stateMachine.setStates([
    { id: "state1", name: "State 1", data: { some: "State" }, assets: [] },
    { id: "state2", name: "State 2", data: { some: "Other State" }, assets: [] }
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

    const newState = stateMachine.createState(
      "New Slide",
      { some: "State" },
      []
    );

    expect(newState.id).not.toBeFalsy();
    expect(newState.name).toEqual("New Slide");
    expect(newState.data).toEqual({ some: "State" });
    expect(stateMachine.states).toHaveLength(3);
    expect(stateMachine.states[2]).toEqual(newState);
    expect(observer).toBeCalled();
  });

  it("Retrieves a state", () => {
    const { stateMachine } = makeTestRig();
    const newState = stateMachine.createState(
      "New Slide",
      { some: "State" },
      []
    );
    const retrievedStateResult = stateMachine.retrieveState(newState.id);

    expect(retrievedStateResult).toEqual(newState);
  });

  it("Returns undefined if an unknowns state is requested", () => {
    const { stateMachine } = makeTestRig();

    const retrievedStateResult = stateMachine.retrieveState("unknownID");
    expect(retrievedStateResult).toBeUndefined();
  });

  it("Updates a state", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    const updatedState: StateMachineState = {
      id: "state1",
      name: "Renamed State 1",
      data: { some: "New Data" },
      assets: []
    };
    stateMachine.updateState(updatedState);

    const retrievedStateResult = stateMachine.retrieveState("state1");

    expect(retrievedStateResult).toEqual(updatedState);
    expect(observer).toBeCalled();
  });

  it("Does not notify if an unknown state is updated", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    const updatedState: StateMachineState = {
      id: "some state",
      name: "Renamed State 1",
      data: { some: "New Data" },
      assets: []
    };
    stateMachine.updateState(updatedState);

    expect(observer).not.toBeCalled();
  });

  it("Deletes a state", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.deleteState("state1");

    expect(stateMachine.states).toHaveLength(1);
    expect(observer).toBeCalled();
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

    expect(stateMachine.activeState?.id).toEqual("state1");
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

    expect(stateMachine.previousState?.id).toEqual("state1");

    stateMachine.clearActiveState();

    expect(stateMachine.previousState).toBeUndefined();
  });

  it("Sets next state as expected", () => {
    const { stateMachine } = makeTestRig();

    expect(stateMachine.nextState).toBeUndefined();

    stateMachine.setActiveStateByID("state1");

    expect(stateMachine.nextState?.id).toEqual("state2");

    stateMachine.setActiveStateByID("state2");

    expect(stateMachine.nextState).toBeUndefined();
  });

  it("Has state", () => {
    const { stateMachine } = makeTestRig();
    expect(stateMachine.hasState("state1")).toEqual(true);
    expect(stateMachine.hasState("somethingElse")).toEqual(false);
  });

  it("Notifies if isAuthoring changes", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.isAuthoring = true;
    expect(observer).toBeCalled();

    observer.mockClear();
    stateMachine.isAuthoring = true;
    stateMachine.isAuthoring = true;
    stateMachine.isAuthoring = true;

    expect(observer).not.toBeCalled();
  });

  it("Notifies when the last edited state changes", () => {
    const { stateMachine, observer } = makeTestRig();
    observer.mockClear();

    stateMachine.lastEditingState = { some: "state" };
    expect(observer).toBeCalled();

    observer.mockClear();
    stateMachine.lastEditingState = { some: "state" };
    stateMachine.lastEditingState = { some: "state" };
    stateMachine.lastEditingState = { some: "state" };

    expect(observer).not.toBeCalled();

    stateMachine.lastEditingState = undefined;
    expect(observer).toBeCalled();
  });
});
