import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateMachine } from "../../StateMachine";
import { makeHostHandlerEntity } from "../Entities";
import { makeOnStateChangeHandler } from "./OnStateChangeHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const uc = makeOnStateChangeHandler(ao);
  return { registerSpy, uc, stateMachine };
}

describe("On State Change Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Sends the state to the state machine", () => {
    const { uc, stateMachine } = makeTestRig();

    uc.action({ foo: "bar" }, ["id1", "id2"], "validation error!");

    expect(stateMachine.lastEditingState).toEqual({ foo: "bar" });
    expect(stateMachine.lastAssets).toEqual(["id1", "id2"]);
    expect(stateMachine.validationErrorMessage).toEqual("validation error!");
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

  it("Triggers the action for v3 with  a validation message", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stateObject: { foo: "bar" },
      assets: ["id1", "id2"],
      validationErrorMessage: "Something is wrong"
    };
    uc.handleRequest(3, payload);

    expect(uc.action).toBeCalledWith(
      { foo: "bar" },
      ["id1", "id2"],
      "Something is wrong"
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
});
