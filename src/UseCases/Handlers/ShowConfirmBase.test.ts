import { makeHostHandler } from '../../Entities';
import { ShowConfirmActionDTO, ShowConfirmBase } from './ShowConfirmBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new ShowConfirmBase(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

function makeBasicDTO(): ShowConfirmActionDTO {
  return {
    title: 'a title',
    message: 'a message',
    confirmButtonLabel: 'confirm button',
    cancelButtonLabel: 'cancel button',
    confirmCallback: jest.fn(),
    cancelCallback: jest.fn(),
  };
}

describe('Get Asset Blob Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new ShowConfirmBase(hostHandler);
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
      title: expectDTO.title,
      message: expectDTO.message,
      confirmButtonLabel: expectDTO.confirmButtonLabel,
      cancelButtonLabel: expectDTO.cancelButtonLabel,
      confirmCallback: expectDTO.confirmCallback,
      cancelCallback: expectDTO.cancelCallback,
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
