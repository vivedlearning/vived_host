import { makeHostHandler } from '../../Entities';
import { ShowSpinnerActionDTO, ShowSpinnerBase } from './ShowSpinnerBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new ShowSpinnerBase(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

function makeBasicDTO(): ShowSpinnerActionDTO {
  return {
    message: 'initial message',
    title: 'initial title',
    closeCallback: jest.fn(),
  };
}

describe('Show Spinner Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new ShowSpinnerBase(hostHandler);
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
      message: expectDTO.message,
      title: expectDTO.title,
      closeCallback: expectDTO.closeCallback,
    };
    getAssetMetaBase.handleRequest(1, payload);

    expect(getAssetMetaBase.action).toBeCalledWith(expectDTO);
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
