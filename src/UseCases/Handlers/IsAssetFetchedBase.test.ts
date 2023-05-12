import { makeHostHandler } from '../../Entities';
import { IsAssetFetchedActionDTO, IsAssetFetchedBase } from './IsAssetFetchedBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new IsAssetFetchedBase(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

function makeBasicDTO(): IsAssetFetchedActionDTO {
  return {
    assetId: 'asset id',
    callback: jest.fn(),
  };
}

describe('Is Asset Fetched Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new IsAssetFetchedBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getAssetMetaBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { getAssetMetaBase } = makeTestRig();

    expect(() => getAssetMetaBase.action(makeBasicDTO())).toThrowError();
  });

  it('Converts the payload into the DTO for the action', () => {
    const { getAssetMetaBase } = makeTestRig();
    getAssetMetaBase.action = jest.fn();

    const expectDTO = makeBasicDTO();
    const payload = {
      assetId: expectDTO.assetId,
      callback: expectDTO.callback,
    };
    getAssetMetaBase.handleRequest(1, payload);

    expect(getAssetMetaBase.action).toBeCalledWith(payload);
  });

  it('Throws for an unsupported version', () => {
    const { getAssetMetaBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetId: 'asset id',
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
