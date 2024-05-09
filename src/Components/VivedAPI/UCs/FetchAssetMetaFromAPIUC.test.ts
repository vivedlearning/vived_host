import { makeHostAppObjectRepo } from '../../../HostAppObject';
import { VivedAPIEntity } from '../Entities/VivedAPIEntity';
import { makeMockJsonRequestUC } from '../Mocks/MockJsonRequestUC';
import { FetchAssetMetaFromAPIUC, makeFetchAssetMetaFromAPIUC } from './FetchAssetMetaFromAPIUC';
import { RequestJSONOptions } from './JsonRequestUC';

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, 'registerSingleton');

  new VivedAPIEntity(appObjects.getOrCreate('API'));

  const mockRequest = makeMockJsonRequestUC(appObjects);
  mockRequest.doRequest.mockResolvedValue(makeMockResp());

  const uc = makeFetchAssetMetaFromAPIUC(appObjects.getOrCreate('ao'));

  return { uc, appObjects, singletonSpy, mockRequest };
}

describe('Fetch Asset Meta', () => {
  it('Registers itself as the Singleton', () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it('Gets the singleton', () => {
    const { uc, appObjects } = makeTestRig();

    expect(FetchAssetMetaFromAPIUC.get(appObjects)).toEqual(uc);
  });

  it('Resolves with the expected DTO', async () => {
    const { uc } = makeTestRig();

    const resp = await uc.doFetch('baseAsset');

    expect(resp.id).toEqual('baseAsset');
    expect(resp.name).toEqual('baseAsset Name');
    expect(resp.description).toEqual('baseAsset Description');
    expect(resp.archived).toEqual(false);
    expect(resp.fileURL).toEqual('www.baseAsset.com');
    expect(resp.filename).toEqual('baseAsset_file.name');
    expect(resp.linkedAssets).toHaveLength(1);
    expect(resp.linkedAssets[0].type).toEqual('someLinkType');
    expect(resp.linkedAssets[0].asset.id).toEqual('linkedAsset');
  });

  it('Requests with the expected url', async () => {
    const { uc, mockRequest } = makeTestRig();

    await uc.doFetch('asset1');

    expect(mockRequest.doRequest).toBeCalled();
    const url = mockRequest.doRequest.mock.calls[0][0] as URL;
    expect(url.toString()).toEqual('https://api.vivedlearning.com/assets/asset1');
  });

  it('Requests with the expected options', async () => {
    const { uc, mockRequest } = makeTestRig();

    await uc.doFetch('asset1');

    expect(mockRequest.doRequest).toBeCalled();
    const options = mockRequest.doRequest.mock.calls[0][1] as RequestJSONOptions;
    expect(options.method).toEqual('GET');
  });

  it('Rejects if the request rejects', () => {
    const { uc, mockRequest } = makeTestRig();
    uc.warn = jest.fn();

    mockRequest.doRequest.mockRejectedValue(new Error('Some Error'));

    return expect(uc.doFetch('asset1')).rejects.toEqual(new Error('Some Error'));
  });

  it('Warns if the request rejects', async () => {
    const { uc, mockRequest } = makeTestRig();
    uc.warn = jest.fn();

    mockRequest.doRequest.mockRejectedValue(new Error('Some Error'));

    expect.assertions(1);
    try {
      await uc.doFetch('asset1');
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(uc.warn).toBeCalled();
    }
  });
});

function makeMockResp() {
  const baseAsset = makeBaseAssetResp('baseAsset');
  const linkedAsset = makeBaseAssetResp('linkedAsset');

  (baseAsset.linkedAssets as any) = [{ type: 'someLinkType', asset: linkedAsset }];

  return { asset: baseAsset };
}

function makeBaseAssetResp(id: string) {
  return {
    id,
    owner: `${id} Owner`,
    name: `${id} Name`,
    description: `${id} Description`,
    archived: false,
    fileURL: `www.${id}.com`,
    filename: `${id}_file.name`,
    linkedAssets: [],
  };
}
