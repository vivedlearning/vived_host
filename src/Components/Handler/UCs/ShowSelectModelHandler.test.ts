import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import { makeShowSelectModelHandler } from "./ShowSelectModelHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeShowSelectModelHandler(ao);
  const callback = jest.fn();
  return { registerSpy, uc, callback };
}

describe("Show Select Model Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc, callback } = makeTestRig();

    expect(() => uc.action(callback)).toThrowError();
  });

  it("Converts the payload into the DTO for the action", () => {
    const { uc, callback } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      callback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(callback);
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

  it("Throws if the payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });
});
