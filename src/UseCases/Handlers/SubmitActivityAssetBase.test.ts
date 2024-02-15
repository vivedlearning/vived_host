import { makeHostHandler } from '../../Entities';
import { SubmitActivityAssetBase } from './SubmitActivityAssetBase';

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const submitActivityAssetBase = new SubmitActivityAssetBase(hostHandler);

  const fileBits: BlobPart[] = ['test', 'file'];
  const testFile: File = new File(fileBits, 'filename.jpg');

  return { hostHandler, submitActivityAssetBase, testFile };
}

describe('Submit Activity Asset Base Handler', () => {
  it('Registers as a handler when constructed', () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const submitActivityAssetBase = new SubmitActivityAssetBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(submitActivityAssetBase);
  });

  it('Throws an error if the action is not overwritten', () => {
    const { submitActivityAssetBase, testFile } = makeTestRig();

    expect(() => submitActivityAssetBase.action(testFile, jest.fn())).toThrowError();
  });

  it('Triggers the action for v1', () => {
    const { submitActivityAssetBase, testFile } = makeTestRig();
    submitActivityAssetBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      assetFile: testFile,
      callback: mockCallback,
    };
    submitActivityAssetBase.handleRequest(1, payload);

    expect(submitActivityAssetBase.action).toBeCalledWith(testFile, mockCallback);
  });

  it('Throws for an unsupported version', () => {
    const { submitActivityAssetBase, testFile } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetFile: testFile,
      callback: mockCallback,
    };

    expect(() => submitActivityAssetBase.handleRequest(-1, payload)).toThrowError();
  });

  it('Throws if the payload is bungled', () => {
    const { submitActivityAssetBase } = makeTestRig();
    submitActivityAssetBase.action = jest.fn();

    const payload = {
      foo: 'bar',
    };

    expect(() => submitActivityAssetBase.handleRequest(1, payload)).toThrowError();
  });
});
