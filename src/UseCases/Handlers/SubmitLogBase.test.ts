import { makeHostHandler } from '../../Entities';
import { SubmitLogBase } from './SubmitLogBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateChange = new SubmitLogBase(hostHandler);
  return { hostHandler, onStateChange };
}

describe('Submit Result Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateChange = new SubmitLogBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(onStateChange);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { onStateChange } = makeTestRig();

    expect(() => onStateChange.action("sender", "ERROR", "a message")).toThrowError();
  });

  it('Throws an unsupported error for version 1', () => {
    const { onStateChange } = makeTestRig();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };

    expect(() => onStateChange.handleRequest(1, payload)).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };
    onStateChange.handleRequest(1, payload);

    expect(onStateChange.action).toBeCalledWith("a sender", "ERROR", "a message");
  });

  it('Throws for an unsupported version', () => {
    const { onStateChange } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: 'anAsset',
      callback: mockCallback,
    };

    expect(() => onStateChange.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the v1 payload is bungled', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => onStateChange.handleRequest(1, payload)).toThrowError();
  });

});
