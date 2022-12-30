import { makeHostHandler } from "../../Entities";
import { StartZSpaceBase } from "./StartZSpaceBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const startZSpace = new StartZSpaceBase(hostHandler);
  return { hostHandler, startZSpace };
}

describe("Start ZSpace base handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const startZSpace = new StartZSpaceBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(startZSpace);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { startZSpace } = makeTestRig();

    expect(() => startZSpace.action()).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { startZSpace } = makeTestRig();
    startZSpace.action = jest.fn();

    startZSpace.handleRequest(1);

    expect(startZSpace.action).toBeCalled();
  });

  it("Throws for an unsupported version", () => {
    const { startZSpace } = makeTestRig();

    expect(() => startZSpace.handleRequest(-1)).toThrowError();
  });
});
