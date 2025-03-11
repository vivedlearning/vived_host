import { makeAppObjectRepo } from "@vived/core";
import {
  ChallengeResponse,
  makeHostEditingStateEntity,
  makeHostStateEntity,
  makeHostStateMachine
} from "../../StateMachine";
import { makeHostHandlerEntity } from "../Entities";
import { makeOnStateChangeHandler } from "./OnStateChangeHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const stateEntity = makeHostStateEntity(appObjects.getOrCreate("state1"));
  const editingEntity = makeHostEditingStateEntity(
    appObjects.getOrCreate("EditingState")
  );
  editingEntity.startEditing(stateEntity);

  const uc = makeOnStateChangeHandler(ao);
  return { registerSpy, uc, editingEntity, stateEntity };
}

describe("On State Change Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Updates the state being edited", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({ foo: "bar" }, ["id1", "id2"], "validation error!");

    expect(stateEntity.stateData).toEqual({ foo: "bar" });
    expect(stateEntity.assets).toEqual(["id1", "id2"]);
  });

  it("Updates the state being edited", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({ foo: "bar" }, ["id1", "id2"], "validation error!");

    expect(stateEntity.stateData).toEqual({ foo: "bar" });
    expect(stateEntity.assets).toEqual(["id1", "id2"]);
  });

  it("Updates the validation error", () => {
    const { uc, editingEntity } = makeTestRig();

    uc.action({ foo: "bar" }, ["id1", "id2"], "validation error!");

    expect(editingEntity.stateValidationMessage).toEqual("validation error!");
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stateObject: { foo: "bar" }
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith({ foo: "bar" }, []);
  });

  it("Triggers the action for v2 with  a validation message", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stateObject: { foo: "bar" },
      validationErrorMessage: "Something is wrong"
    };
    uc.handleRequest(2, payload);

    expect(uc.action).toBeCalledWith({ foo: "bar" }, [], "Something is wrong");
  });

  it("Triggers the action for v2 without a validation message", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stateObject: { foo: "bar" }
    };
    uc.handleRequest(2, payload);

    expect(uc.action).toBeCalledWith({ foo: "bar" }, [], undefined);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the v1 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Throws if the v2 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(2, payload)).toThrowError();
  });

  it("Triggers the action for v4", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stateObject: { foo: "bar" },
      assets: ["id1", "id2"],
      validationErrorMessage: "Something is wrong",
      responseType: "HIT"
    };
    uc.handleRequest(4, payload);

    expect(uc.action).toBeCalledWith(
      { foo: "bar" },
      ["id1", "id2"],
      "Something is wrong",
      "HIT"
    );
  });

  it("Throws if the v3 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(3, payload)).toThrowError();
  });

  it("Sets the expected results to NONE", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "NONE");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.NONE);
  });

  it("Sets the expected results to MULTIHIT", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "MULTIHIT");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.MULTIHIT);
  });

  it("Sets the expected results to HIT", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "HIT");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.HIT);
  });

  it("Sets the expected results to PROGRESS", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "PROGRESS");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.PROGRESS);
  });

  it("Sets the expected results to QUALITY", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "QUALITY");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.QUALITY);
  });

  it("Sets the expected results to SCORE", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.action({}, [], undefined, "SCORE");
    expect(stateEntity.expectedResponse).toEqual(ChallengeResponse.SCORE);
  });

  it("Warns if it encounters an unknown response", () => {
    const { uc, stateEntity } = makeTestRig();

    uc.warn = jest.fn();

    uc.action({}, [], undefined, "YourMom");
    expect(uc.warn).toBeCalled();
    expect(stateEntity.expectedResponse).toBeUndefined();
  });
});
