import { makeHostHandler } from '../../Entities';
import { OnAppIsReadyBase } from './OnAppIsReadyBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateComplete = new OnAppIsReadyBase(hostHandler);
  return { hostHandler, onStateComplete };
}

describe('On App Ready Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateComplete = new OnAppIsReadyBase(hostHandler);
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
    
    expect(() => onStateComplete.handleRequest(-1)).toThrowError();
  });
});
