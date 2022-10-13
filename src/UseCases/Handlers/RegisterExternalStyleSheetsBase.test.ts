import { makeHostHandler } from '../../Entities';
import { RegisterExternalStyleSheetsBase } from './RegisterExternalStyleSheetsBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateChange = new RegisterExternalStyleSheetsBase(hostHandler);
  return { hostHandler, onStateChange };
}

describe('Register Style Sheets Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateChange = new RegisterExternalStyleSheetsBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(onStateChange);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { onStateChange } = makeTestRig();

    expect(() => onStateChange.action(['a stylesheet'])).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      stylesheets: ['a stylesheet'],
    };
    onStateChange.handleRequest(1, payload);

    expect(onStateChange.action).toBeCalledWith(['a stylesheet']);
  });

  it('Throws for an unsupported version', () => {
    const { onStateChange } = makeTestRig();

    const payload = {
      stylesheets: ['a stylesheet'],
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
