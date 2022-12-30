import { makeHostHandler } from "../../Entities";
import { HasPreviousStateBase } from "./HasPreviousStateBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const hasPreviousStateBase = new HasPreviousStateBase(hostHandler);
  return { hostHandler, hasPreviousStateBase };
}

describe("Has Previous State Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const hasPreviousStateBase = new HasPreviousStateBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(hasPreviousStateBase);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { hasPreviousStateBase } = makeTestRig();

    expect(() => hasPreviousStateBase.action(jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { hasPreviousStateBase } = makeTestRig();
    hasPreviousStateBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };
    hasPreviousStateBase.handleRequest(1, payload);

    expect(hasPreviousStateBase.action).toBeCalledWith(mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { hasPreviousStateBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };

    expect(()=>hasPreviousStateBase.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", ()=>{
    const { hasPreviousStateBase } = makeTestRig();
    hasPreviousStateBase.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(()=>hasPreviousStateBase.handleRequest(1, payload)).toThrowError();
  })
});
