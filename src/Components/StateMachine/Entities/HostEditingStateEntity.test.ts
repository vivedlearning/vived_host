import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeHostEditingStateEntity,
  HostEditingStateEntity
} from "./HostEditingStateEntity";
import { makeMockHostStateEntity } from "../Mocks";
import { makeHostStateEntity, StateDTO, ChallengeResponse } from "./HostStateEntity";
import { makeHostStateMachine } from "./HostStateMachine";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("State1");
  const editStateEntity = makeHostEditingStateEntity(ao);
  const observer = jest.fn();
  editStateEntity.addChangeObserver(observer);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("State Machine")
  );

  return {
    appObjects,
    ao,
    editStateEntity,
    observer,
    registerSingletonSpy,
    stateMachine
  };
}

describe("Host Edit State Entity", () => {
  it("Gets the singleton", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    expect(HostEditingStateEntity.get(appObjects)).toEqual(editStateEntity);
  });

  it("Register as the singleton", () => {
    const { editStateEntity, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(editStateEntity);
  });

  it("Set is editing to true when we start editing", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);
    expect(editStateEntity.isEditing).toEqual(false);

    editStateEntity.startEditing(state);

    expect(editStateEntity.isEditing).toEqual(true);
  });

  it("Set the state when we start editing", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    expect(editStateEntity.editingState).toBeUndefined();

    editStateEntity.startEditing(state);

    expect(editStateEntity.editingState).toEqual(state);
  });

  it("Notifies when we start editing", () => {
    const { editStateEntity, appObjects, observer } = makeTestRig();

    observer.mockClear();

    const state = makeMockHostStateEntity("state1", appObjects);

    editStateEntity.startEditing(state);

    expect(observer).toBeCalledTimes(1);
  });

  it("Finish editing clears the state", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    editStateEntity.startEditing(state);
    expect(editStateEntity.isEditing).toEqual(true);

    editStateEntity.finishEditing();

    expect(editStateEntity.isEditing).toEqual(false);
  });

  it("Finish sets is editing to false", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    editStateEntity.startEditing(state);
    expect(editStateEntity.isEditing).toEqual(true);

    editStateEntity.finishEditing();

    expect(editStateEntity.isEditing).toEqual(false);
  });

  it("Notifies when we finish editing", () => {
    const { editStateEntity, appObjects, observer } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);
    editStateEntity.startEditing(state);
    observer.mockClear();
    editStateEntity.finishEditing();

    expect(observer).toBeCalledTimes(1);
  });

  it("Cancel editing clears the state", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    editStateEntity.startEditing(state);
    expect(editStateEntity.editingState).toEqual(state);

    editStateEntity.cancelEditState();

    expect(editStateEntity.editingState).toBeUndefined();
  });

  it("Cancel sets is editing to false", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    editStateEntity.startEditing(state);
    expect(editStateEntity.isEditing).toEqual(true);

    editStateEntity.cancelEditState();

    expect(editStateEntity.isEditing).toEqual(false);
  });

  it("Notifies when we Cancel editing", () => {
    const { editStateEntity, appObjects, observer } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);
    editStateEntity.startEditing(state);
    observer.mockClear();
    editStateEntity.cancelEditState();

    expect(observer).toBeCalledTimes(1);
  });

  it("Revert changes to the entity if editing is cancelled", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeMockHostStateEntity("state1", appObjects);

    const originalDTO: StateDTO = {
      appID: "AppID",
      assets: ["Asset 1", "Asset 2"],
      data: { some: "Data" },
      id: "sate 1",
      name: "name",
      response: ChallengeResponse.HIT
    };
    state.getDTO.mockReturnValue(originalDTO);

    editStateEntity.startEditing(state);
    editStateEntity.cancelEditState();

    expect(state.setDTO).toBeCalledWith(originalDTO);
  });

  it("Checks for a change in the name", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.name = "Name";

    editStateEntity.startEditing(state);

    expect(editStateEntity.somethingHasChanged).toEqual(false);

    state.name = "Changed";

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.name = "Name";

    expect(editStateEntity.somethingHasChanged).toEqual(false);
  });

  it("Checks for a change in the data", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.setStateData({ foo: "Bar" });

    editStateEntity.startEditing(state);

    expect(editStateEntity.somethingHasChanged).toEqual(false);

    state.setStateData({ foo: "CHANGED" });

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.setStateData({ foo: "Bar" });

    expect(editStateEntity.somethingHasChanged).toEqual(false);
  });

  it("Checks for a change in the assets", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.assets = ["Asset 1", "Asset 2"];

    editStateEntity.startEditing(state);

    expect(editStateEntity.somethingHasChanged).toEqual(false);

    state.assets = ["Asset 1", "Asset CHANGED"];

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.assets = ["Asset 1"];

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.assets = ["Asset 1", "Asset 2", "Asset 3"];

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.assets = ["Asset 1", "Asset 2"];

    expect(editStateEntity.somethingHasChanged).toEqual(false);
  });

  it("Checks for a change in the expected response", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.expectedResponse = ChallengeResponse.NONE;

    editStateEntity.startEditing(state);

    expect(editStateEntity.somethingHasChanged).toEqual(false);

    state.expectedResponse = ChallengeResponse.MULTIHIT;

    expect(editStateEntity.somethingHasChanged).toEqual(true);

    state.expectedResponse = ChallengeResponse.NONE;

    expect(editStateEntity.somethingHasChanged).toEqual(false);
  });

  it("Creates a new state from the state machine", () => {
    const { editStateEntity, stateMachine } = makeTestRig();

    const newStateSpy = jest.spyOn(stateMachine, "createNewState");

    expect(editStateEntity.editingState).toBeUndefined();
    editStateEntity.startNewState();

    expect(editStateEntity.editingState).not.toBeUndefined();
    expect(newStateSpy).toBeCalled();
  });

  it("Always has a change if it is a new state", () => {
    const { editStateEntity } = makeTestRig();

    editStateEntity.startNewState();

    expect(editStateEntity.somethingHasChanged).toEqual(true);
  });

  it("Deletes the new state if cancelled", () => {
    const { editStateEntity, stateMachine } = makeTestRig();

    expect(editStateEntity.editingState).toBeUndefined();
    editStateEntity.startNewState();

    const newState = editStateEntity.editingState;

    expect(stateMachine.hasState(newState!.id)).toEqual(true);

    editStateEntity.cancelEditState();

    expect(stateMachine.hasState(newState!.id)).toEqual(false);
  });

  it("Notifies when the state validation message changes", ()=>{
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.stateValidationMessage = "Some Message";
    editStateEntity.stateValidationMessage = "Some Message";
    editStateEntity.stateValidationMessage = "Some Message";

    expect(observer).toBeCalledTimes(1);

    editStateEntity.stateValidationMessage = undefined;
    editStateEntity.stateValidationMessage = undefined;
    editStateEntity.stateValidationMessage = undefined;

    expect(observer).toBeCalledTimes(2);
  })

  it("Clears the validation message when cancelled", ()=>{
    const { editStateEntity, appObjects } = makeTestRig();
    const state = makeMockHostStateEntity("state1", appObjects);
    editStateEntity.startEditing(state);

    editStateEntity.stateValidationMessage = "Some Message";

    editStateEntity.cancelEditState();

    expect(editStateEntity.stateValidationMessage).toBeUndefined();
  })

  it("Clears the validation message when finished", ()=>{
    const { editStateEntity, appObjects } = makeTestRig();
    const state = makeMockHostStateEntity("state1", appObjects);
    editStateEntity.startEditing(state);

    editStateEntity.stateValidationMessage = "Some Message";

    editStateEntity.finishEditing();

    expect(editStateEntity.stateValidationMessage).toBeUndefined();
  })

  it("Notifies when the has changed flag changes", ()=>{
    const { editStateEntity, appObjects, observer } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.expectedResponse = ChallengeResponse.NONE;
    editStateEntity.startEditing(state);

    observer.mockClear();

    state.expectedResponse = ChallengeResponse.HIT;
    state.expectedResponse = ChallengeResponse.MULTIHIT;
    state.expectedResponse = ChallengeResponse.PROGRESS;

    expect(observer).toHaveBeenCalledTimes(1);

    observer.mockClear();

    state.expectedResponse = ChallengeResponse.NONE;

    expect(observer).toHaveBeenCalledTimes(1);
  })

  it("Sets the is new flag", ()=>{
    const { editStateEntity } = makeTestRig();

    expect(editStateEntity.isNewState).toEqual(false);

    editStateEntity.startNewState();

    expect(editStateEntity.isNewState).toEqual(true);

    editStateEntity.finishEditing();

    expect(editStateEntity.isNewState).toEqual(false);
  })
});
