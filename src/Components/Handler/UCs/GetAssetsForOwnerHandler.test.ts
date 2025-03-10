import { makeAppObjectRepo } from "@vived/core";
import { makeHostHandlerEntity } from "../Entities";
import { makeGetAssetsForOwnerHandler } from "./GetAssetsForOwnerHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeGetAssetsForOwnerHandler(ao);
  return { registerSpy, uc };
}

describe("Get Assets for owner Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc } = makeTestRig();

    expect(() => uc.action("anOwner", jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      ownerID: "anOwner",
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith("anOwner", mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      ownerID: "anOwner",
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });
});
