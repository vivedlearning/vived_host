import { makeHostHandler } from '../../Entities';
import { OnStateCompleteBase } from './OnStateCompleteBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateComplete = new OnStateCompleteBase(hostHandler);
  return { hostHandler, onStateComplete };
}

describe('On State Complete Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateComplete = new OnStateCompleteBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(onStateComplete);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { onStateComplete } = makeTestRig();

    expect(() => onStateComplete.action()).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { onStateComplete } = makeTestRig();
    onStateComplete.action = jest.fn();

    onStateComplete.handleRequest(1);

    expect(onStateComplete.action).toBeCalled();
  });

  it('Throws for an unsupported version', () => {
    const { onStateComplete } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: 'anAsset',
      callback: mockCallback,
    };

    expect(() => onStateComplete.handleRequest(-1)).toThrowError();
  });
});
