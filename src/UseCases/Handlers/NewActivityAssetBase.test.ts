import { makeHostHandler } from '../../Entities';
import { NewActivityAssetBase } from './NewActivityAssetBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const newActivityAssetBase = new NewActivityAssetBase(hostHandler);
  return { hostHandler, newActivityAssetBase };
}



describe('Get Asset Blob Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const newActivityAssetBase = new NewActivityAssetBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(newActivityAssetBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { newActivityAssetBase } = makeTestRig();

    const mockFile = new File([], 'file.name');

    expect(() => newActivityAssetBase.action(mockFile, jest.fn())).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { newActivityAssetBase } = makeTestRig();
    newActivityAssetBase.action = jest.fn();

    global.File = class MockFile {
      filename: string;
      constructor(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], filename: string, properties ? : FilePropertyBag) {
        this.filename = filename;
      }
    }

    const mockFile = new File([], 'file.name');

    const mockCallback = jest.fn();
    const payload = {
      file: mockFile,
      callback: mockCallback,
    };
    newActivityAssetBase.handleRequest(1, payload);

    expect(newActivityAssetBase.action).toBeCalledWith(mockFile, mockCallback);
  });

  it('Throws for an unsupported version', () => {
    const { newActivityAssetBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: 'anAsset',
      callback: mockCallback,
    };

    expect(() => newActivityAssetBase.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the payload is bungled', () => {
    const { newActivityAssetBase } = makeTestRig();
    newActivityAssetBase.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => newActivityAssetBase.handleRequest(1, payload)).toThrowError();
  });
});
