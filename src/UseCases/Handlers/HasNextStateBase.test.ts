import { makeHostHandler } from "../../Entities";
import { HasNextStateBase } from "./HasNextStateBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const hasNextStateBase = new HasNextStateBase(hostHandler);
  return { hostHandler, hasNextStateBase };
}

describe("Has Next State Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const hasNextStateBase = new HasNextStateBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(hasNextStateBase);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { hasNextStateBase } = makeTestRig();

    expect(() => hasNextStateBase.action(jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { hasNextStateBase } = makeTestRig();
    hasNextStateBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };
    hasNextStateBase.handleRequest(1, payload);

    expect(hasNextStateBase.action).toBeCalledWith(mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { hasNextStateBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };

    expect(()=>hasNextStateBase.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", ()=>{
    const { hasNextStateBase } = makeTestRig();
    hasNextStateBase.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(()=>hasNextStateBase.handleRequest(1, payload)).toThrowError();
  })
});
