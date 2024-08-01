import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeHostEditingStateEntity,
  ChallengeResponse,
  HostEditingStateEntity
} from "./HostEditingStateEntity";
import { makeHostStateEntity } from "./HostStateEntity";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("State1");
  const editStateEntity = makeHostEditingStateEntity(ao);
  const observer = jest.fn();
  editStateEntity.addChangeObserver(observer);

  return { appObjects, ao, editStateEntity, observer, registerSingletonSpy };
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

  it("Sets the name", () => {
    const { editStateEntity } = makeTestRig();

    expect(editStateEntity.name).toEqual("");

    editStateEntity.name = "State Name";

    expect(editStateEntity.name).toEqual("State Name");
  });

  it("Notifies when the name changes", () => {
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.name = "State Name";
    editStateEntity.name = "State Name";
    editStateEntity.name = "State Name";
    editStateEntity.name = "State Name";

    expect(observer).toBeCalledTimes(1);
  });

  it("Sets the data", () => {
    const { editStateEntity } = makeTestRig();

    expect(editStateEntity.stateData).toEqual({});

    editStateEntity.stateData = { foo: "bar" };

    expect(editStateEntity.stateData).toEqual({ foo: "bar" });
  });

  it("Notifies only if there is a change in the data", () => {
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.stateData = { foo: "bar" };
    editStateEntity.stateData = { foo: "bar" };
    editStateEntity.stateData = { foo: "bar" };
    editStateEntity.stateData = { foo: "bar" };

    expect(observer).toBeCalledTimes(1);
  });

  it("Sets the assets", () => {
    const { editStateEntity } = makeTestRig();

    expect(editStateEntity.assets).toEqual([]);

    editStateEntity.assets = ["asset1", "asset2"];

    expect(editStateEntity.assets).toEqual(["asset1", "asset2"]);
  });

  it("Notifies only when the assets list change", () => {
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.assets = ["asset1"];
    editStateEntity.assets = ["asset1", "asset2"];
    editStateEntity.assets = ["asset1", "asset2"];
    editStateEntity.assets = ["asset1", "asset2"];
    editStateEntity.assets = ["asset1"];

    expect(observer).toBeCalledTimes(3);
  });

  it("Notifies only when the assets in the list change", () => {
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.assets = ["asset1", "asset2"];
    editStateEntity.assets = ["asset1", "DifferentAsset"];

    expect(observer).toBeCalledTimes(2);
  });

  it("Sets the response", () => {
    const { editStateEntity } = makeTestRig();

    expect(editStateEntity.expectedResponse).toBeUndefined();

    editStateEntity.expectedResponse = ChallengeResponse.HIT;

    expect(editStateEntity.expectedResponse).toEqual(ChallengeResponse.HIT);
  });

  it("Notifies only if there is a change in the response", () => {
    const { editStateEntity, observer } = makeTestRig();

    editStateEntity.expectedResponse = ChallengeResponse.HIT;
    editStateEntity.expectedResponse = ChallengeResponse.HIT;
    editStateEntity.expectedResponse = ChallengeResponse.HIT;
    editStateEntity.expectedResponse = ChallengeResponse.HIT;

    expect(observer).toBeCalledTimes(1);
  });

  it("Sets up properties for a state when we start editing", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.appID = "State1App";
    state.name = "State 1 Name";
    state.expectedResponse = ChallengeResponse.PROGRESS;
    state.setStateData({ foo: "bar" });
    state.assets = ["asset1", "asset2"];

    editStateEntity.startEditing(state);

    expect(editStateEntity.name).toEqual("State 1 Name");
    expect(editStateEntity.expectedResponse).toEqual(
      ChallengeResponse.PROGRESS
    );
    expect(editStateEntity.appID).toEqual("State1App");
    expect(editStateEntity.assets).toEqual(["asset1", "asset2"]);
    expect(editStateEntity.stateData).toEqual({ foo: "bar" });
    expect(editStateEntity.id).toEqual("State1");
  });

  it("Set is editing to true when we start editing", () => {
    const { editStateEntity, appObjects } = makeTestRig();

    const state = makeHostStateEntity(appObjects.getOrCreate("State1"));
    state.appID = "State1App";
    state.name = "State 1 Name";
    state.expectedResponse = ChallengeResponse.PROGRESS;
    state.setStateData({ foo: "bar" });
    state.assets = ["asset1", "asset2"];

    expect(editStateEntity.isEditing).toEqual(false);

    editStateEntity.startEditing(state);

    expect(editStateEntity.isEditing).toEqual(true);
  });
});
