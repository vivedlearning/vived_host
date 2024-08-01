import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import { makeSubmitLogHandler } from "./SubmitLogHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeSubmitLogHandler(ao);
  return { registerSpy, uc };
}

describe("Submit Result Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc } = makeTestRig();

    expect(() => uc.action("sender", "ERROR", "a message")).toThrowError();
  });

  it("Throws an unsupported error for version 1", () => {
    const { uc } = makeTestRig();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith("a sender", "ERROR", "a message");
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
});
