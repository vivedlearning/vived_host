import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeHostStateEntity,
  ChallengeResponse,
  StateDTO
} from "./HostStateEntity";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("State1");
  const entity = makeHostStateEntity(ao);
  const observer = jest.fn();
  entity.addChangeObserver(observer);

  return { appObjects, ao, entity, observer };
}

describe("Host State Entity", () => {
  it("Sets the ID to the App Object ID", () => {
    const { entity } = makeTestRig();
    expect(entity.id).toEqual("State1");
  });

  it("Sets the name", () => {
    const { entity } = makeTestRig();

    expect(entity.name).toEqual("");

    entity.name = "State Name";

    expect(entity.name).toEqual("State Name");
  });

  it("Notifies when the name changes", () => {
    const { entity, observer } = makeTestRig();

    entity.name = "State Name";
    entity.name = "State Name";
    entity.name = "State Name";
    entity.name = "State Name";

    expect(observer).toBeCalledTimes(1);
  });

  it("Sets the data", () => {
    const { entity } = makeTestRig();

    expect(entity.stateData).toEqual({});

    entity.setStateData({ foo: "bar" });

    expect(entity.stateData).toEqual({ foo: "bar" });
  });

  it("Notifies only if there is a change in the data and check for change has been set", () => {
    const { entity, observer } = makeTestRig();

    entity.setStateData({ foo: "bar" }, true);
    entity.setStateData({ foo: "bar" }, true);
    entity.setStateData({ foo: "bar" }, true);
    entity.setStateData({ foo: "bar" }, true);

    expect(observer).toBeCalledTimes(1);
  });

  it("Notifies every time the data is set if check for change has no been set or is false", () => {
    const { entity, observer } = makeTestRig();

    entity.setStateData({ foo: "bar" });
    entity.setStateData({ foo: "bar" });
    entity.setStateData({ foo: "bar" }, false);
    entity.setStateData({ foo: "bar" }, false);

    expect(observer).toBeCalledTimes(4);
  });

  it("Sets the assets", () => {
    const { entity } = makeTestRig();

    expect(entity.assets).toEqual([]);

    entity.assets = ["asset1", "asset2"];

    expect(entity.assets).toEqual(["asset1", "asset2"]);
  });

  it("Notifies only when the assets list change", () => {
    const { entity, observer } = makeTestRig();

    entity.assets = ["asset1"];
    entity.assets = ["asset1", "asset2"];
    entity.assets = ["asset1", "asset2"];
    entity.assets = ["asset1", "asset2"];
    entity.assets = ["asset1"];

    expect(observer).toBeCalledTimes(3);
  });

  it("Notifies only when the assets in the list change", () => {
    const { entity, observer } = makeTestRig();

    entity.assets = ["asset1", "asset2"];
    entity.assets = ["asset1", "DifferentAsset"];

    expect(observer).toBeCalledTimes(2);
  });

  it("Sets the response", () => {
    const { entity } = makeTestRig();

    expect(entity.expectedResponse).toBeUndefined();

    entity.expectedResponse = ChallengeResponse.HIT;

    expect(entity.expectedResponse).toEqual(ChallengeResponse.HIT);
  });

  it("Notifies only if there is a change in the response", () => {
    const { entity, observer } = makeTestRig();

    entity.expectedResponse = ChallengeResponse.HIT;
    entity.expectedResponse = ChallengeResponse.HIT;
    entity.expectedResponse = ChallengeResponse.HIT;
    entity.expectedResponse = ChallengeResponse.HIT;

    expect(observer).toBeCalledTimes(1);
  });

  it("Gets the DTO", () => {
    const { entity } = makeTestRig();

    entity.name = "A Name";
    entity.assets = ["Asset 1", "Asset 2"];
    entity.setStateData({ foo: "bar" });
    entity.expectedResponse = ChallengeResponse.MULTIHIT;
    entity.appID = "anAppID";

    expect(entity.getDTO()).toEqual({
      id: "State1",
      name: "A Name",
      data: { foo: "bar" },
      assets: ["Asset 1", "Asset 2"],
      response: "MULTIHIT",
      appID: "anAppID"
    });
  });

  it("Sets the DTO", () => {
    const { entity } = makeTestRig();

    const dto: StateDTO = {
      id: "State1",
      name: "A Name",
      data: { foo: "bar" },
      assets: ["Asset 1", "Asset 2"],
      response: "MULTIHIT",
      appID: "anAppID"
    };

    entity.setDTO(dto);

    expect(entity.name).toEqual("A Name");
    expect(entity.assets).toEqual(["Asset 1", "Asset 2"]);
    expect(entity.stateData).toEqual({ foo: "bar" });
    expect(entity.expectedResponse).toEqual(ChallengeResponse.MULTIHIT);
    expect(entity.appID).toEqual("anAppID");
  });

  it("Warns if the DTO as a different ID and does not set", () => {
    const { entity } = makeTestRig();

    entity.warn = jest.fn();

    const dto: StateDTO = {
      id: "SomeOtherState",
      name: "A Name",
      data: { foo: "bar" },
      assets: ["Asset 1", "Asset 2"],
      response: "MULTIHIT",
      appID: "anAppID"
    };

    entity.setDTO(dto);

    expect(entity.name).toEqual("");
    expect(entity.warn).toBeCalled();
  });

  it("Sets the expected response to undefined if undefined in the DTO", () => {
    const { entity } = makeTestRig();

    entity.expectedResponse = ChallengeResponse.MULTIHIT;

    const dto: StateDTO = {
      id: "State1",
      name: "A Name",
      data: { foo: "bar" },
      assets: ["Asset 1", "Asset 2"],
      response: undefined,
      appID: "anAppID"
    };

    entity.setDTO(dto);

    expect(entity.expectedResponse).toBeUndefined();
  });

  it("Defaults the response to undefined if the DTO has an unsupported name", () => {
    const { entity } = makeTestRig();

    entity.expectedResponse = ChallengeResponse.MULTIHIT;

    const dto: StateDTO = {
      id: "State1",
      name: "A Name",
      data: { foo: "bar" },
      assets: ["Asset 1", "Asset 2"],
      response: "BoogeredResponse",
      appID: "anAppID"
    };

    entity.setDTO(dto);

    expect(entity.expectedResponse).toBeUndefined();
  });

  it("Sets the app", () => {
    const { entity } = makeTestRig();

    expect(entity.appID).toEqual("");

    entity.appID = "App1";

    expect(entity.appID).toEqual("App1");
  });

  it("Notifies when the appID changes", () => {
    const { entity, observer } = makeTestRig();

    entity.appID = "App1";
    entity.appID = "App1";
    entity.appID = "App1";
    entity.appID = "App1";

    expect(observer).toBeCalledTimes(1);
  });
});
