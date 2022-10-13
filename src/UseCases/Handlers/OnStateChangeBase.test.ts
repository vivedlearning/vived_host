import { makeHostHandler } from '../../Entities';
import { OnStateChangeBase } from './OnStateChangeBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateChange = new OnStateChangeBase(hostHandler);
  return { hostHandler, onStateChange };
}

describe('On State Change Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateChange = new OnStateChangeBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(onStateChange);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { onStateChange } = makeTestRig();

    expect(() => onStateChange.action({ foo: 'bar' })).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      stateObject: { foo: 'bar' },
    };
    onStateChange.handleRequest(1, payload);

    expect(onStateChange.action).toBeCalledWith({ foo: 'bar' });
  });

  it('Triggers the action for v2 with  a validation messag', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      stateObject: { foo: 'bar' },
      validationErrorMessage: 'Something is wrong',
    };
    onStateChange.handleRequest(2, payload);

    expect(onStateChange.action).toBeCalledWith({ foo: 'bar' }, 'Something is wrong');
  });

  it('Triggers the action for v2 without a validation message', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      stateObject: { foo: 'bar' },
    };
    onStateChange.handleRequest(2, payload);

    expect(onStateChange.action).toBeCalledWith({ foo: 'bar' }, undefined);
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

  it('Throws if the v2 payload is bungled', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => onStateChange.handleRequest(2, payload)).toThrowError();
  });
});
