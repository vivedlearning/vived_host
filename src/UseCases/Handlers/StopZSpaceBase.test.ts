import { makeHostHandler } from "../../Entities";
import { StopZSpaceBase } from "./StopZSpaceBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const stopZSpace = new StopZSpaceBase(hostHandler);
  return { hostHandler, stopZSpace };
}

describe("Stop ZSpace base handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const stopZSpace = new StopZSpaceBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(stopZSpace);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { stopZSpace } = makeTestRig();

    expect(() => stopZSpace.action()).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { stopZSpace } = makeTestRig();
    stopZSpace.action = jest.fn();

    stopZSpace.handleRequest(1);

    expect(stopZSpace.action).toBeCalled();
  });

  it("Throws for an unsupported version", () => {
    const { stopZSpace } = makeTestRig();

    expect(() => stopZSpace.handleRequest(-1)).toThrowError();
  });
});
