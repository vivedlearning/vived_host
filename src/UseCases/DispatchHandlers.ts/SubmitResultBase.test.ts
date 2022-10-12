import { makeHostHandler } from '../../Entities';
import { MultiHitResultV1, SubmitResult } from './SubmitResultBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const onStateChange = new SubmitResult(hostHandler);
  return { hostHandler, onStateChange };
}

describe('Submit Result Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const onStateChange = new SubmitResult(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(onStateChange);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { onStateChange } = makeTestRig();

    expect(() => onStateChange.action('HIT_V1', { success: true }, 'A question!')).toThrowError();
  });

  it('Throws an unsupported error for version 1', () => {
    const { onStateChange } = makeTestRig();

    const payload = {
      foo: 'bar',
    };

    expect(() => onStateChange.handleRequest(1, payload)).toThrowError();
  });

  it('Triggers the action for v2', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3,
    };

    const payload = {
      tries: 5,
      description: 'A Question!',
      result,
      resultType: 'MULTIHIT_V1',
    };

    onStateChange.handleRequest(2, payload);

    expect(onStateChange.action).toBeCalledWith('MULTIHIT_V1', result, 'A Question!');
  });

  it('Triggers the action for v3', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3,
    };

    const payload = {
      description: 'A Question!',
      result,
      resultType: 'MULTIHIT_V1',
    };

    onStateChange.handleRequest(3, payload);

    expect(onStateChange.action).toBeCalledWith('MULTIHIT_V1', result, 'A Question!');
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

  it('Throws if the v2 payload is bungled', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => onStateChange.handleRequest(2, payload)).toThrowError();
  });

  it('Throws if the v3 payload is bungled', () => {
    const { onStateChange } = makeTestRig();
    onStateChange.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => onStateChange.handleRequest(3, payload)).toThrowError();
  });
});
