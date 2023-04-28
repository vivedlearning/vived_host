import { makeHostHandler } from '../../Entities';
import { ShowSelectModelBase } from './ShowSelectModelBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new ShowSelectModelBase(hostHandler);
  const callback = jest.fn();
  return { hostHandler, getAssetMetaBase, callback };
}

describe('Show Select Model Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new ShowSelectModelBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getAssetMetaBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { getAssetMetaBase, callback } = makeTestRig();

    expect(() => getAssetMetaBase.action(callback)).toThrowError();
  });

  it('Converts the payload into the DTO for the action', () => {
    const { getAssetMetaBase, callback } = makeTestRig();
    getAssetMetaBase.action = jest.fn();
  
    const payload = {    
      callback,
    };
    getAssetMetaBase.handleRequest(1, payload);

    expect(getAssetMetaBase.action).toBeCalledWith(callback);
  });

  it('Throws for an unsupported version', () => {
    const { getAssetMetaBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: 'anAsset',
      callback: mockCallback,
    };

    expect(() => getAssetMetaBase.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the payload is bungled', () => {
    const { getAssetMetaBase } = makeTestRig();
    getAssetMetaBase.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => getAssetMetaBase.handleRequest(1, payload)).toThrowError();
  });
});
