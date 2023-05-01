import { makeHostHandler } from '../../Entities';
import { ShowMarkDownEditorActionDTO, ShowMarkDownEditor } from './ShowMarkDownEditor';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new ShowMarkDownEditor(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

function makeBasicDTO(): ShowMarkDownEditorActionDTO {
  return {
    initialText: 'initial text',
    confirmCallback: jest.fn(),
  };
}

describe('Show MarkDown Editor Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new ShowMarkDownEditor(hostHandler);
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
      initialText: expectDTO.initialText,
      confirmCallback: expectDTO.confirmCallback,
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
