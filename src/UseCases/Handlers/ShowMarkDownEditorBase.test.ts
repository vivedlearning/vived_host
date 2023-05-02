import { makeHostHandler } from '../../Entities';
import { ShowMarkDownEditorActionDTO, ShowMarkDownEditorBase } from './ShowMarkDownEditorBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new ShowMarkDownEditorBase(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

function makeBasicDTO(withOptional: boolean = true): ShowMarkDownEditorActionDTO {
  if (!withOptional) {
    return {
      initialText: 'initial text',
      submitCallback: jest.fn(),
    };
  }

  return {
    initialText: 'initial text',
    submitCallback: jest.fn(),
    validateString: jest.fn(),
  };
}

describe('Show MarkDown Editor Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new ShowMarkDownEditorBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getAssetMetaBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { getAssetMetaBase } = makeTestRig();

    expect(() => getAssetMetaBase.action(makeBasicDTO())).toThrowError();
  });

  it('Converts the payload into the DTO for the action', () => {
    const { getAssetMetaBase } = makeTestRig();
    getAssetMetaBase.action = jest.fn();

    const expectDTOWithOptional = makeBasicDTO();
    const payloadWithOptional = {
      initialText: expectDTOWithOptional.initialText,
      submitCallback: expectDTOWithOptional.submitCallback,
      validateString: expectDTOWithOptional.validateString,
    };
    getAssetMetaBase.handleRequest(1, payloadWithOptional);

    expect(getAssetMetaBase.action).toBeCalledWith(expectDTOWithOptional);

    const expectDTOWithoutOptional = makeBasicDTO(false);
    const payloadWithoutOptional = {
      initialText: expectDTOWithoutOptional.initialText,
      submitCallback: expectDTOWithoutOptional.submitCallback,
    };
    getAssetMetaBase.handleRequest(1, payloadWithoutOptional);

    expect(getAssetMetaBase.action).toBeCalledWith(expectDTOWithoutOptional);
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
