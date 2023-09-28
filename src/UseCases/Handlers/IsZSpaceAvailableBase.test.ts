import { makeHostHandler } from '../../Entities';
import { IsZSpaceAvailableBase } from './IsZSpaceAvailableBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const isZSpaceAvailableBase = new IsZSpaceAvailableBase(hostHandler);
  return { hostHandler, isZSpaceAvailableBase };
}

describe('Is zSpace Available Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const isZSpaceAvailableBase = new IsZSpaceAvailableBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(isZSpaceAvailableBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { isZSpaceAvailableBase } = makeTestRig();

    expect(() => isZSpaceAvailableBase.action(jest.fn())).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { isZSpaceAvailableBase } = makeTestRig();
    isZSpaceAvailableBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };
    isZSpaceAvailableBase.handleRequest(1, payload);

    expect(isZSpaceAvailableBase.action).toBeCalledWith(mockCallback);
  });

  it('Throws for an unsupported version', () => {
    const { isZSpaceAvailableBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };

    expect(() => isZSpaceAvailableBase.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the payload is bungled', () => {
    const { isZSpaceAvailableBase } = makeTestRig();
    isZSpaceAvailableBase.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => isZSpaceAvailableBase.handleRequest(1, payload)).toThrowError();
  });
});
