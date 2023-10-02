import { makeVivedAPI } from './VivedAPI';

function makeTestRig() {
  const vivedAPI = makeVivedAPI();
  const observer = jest.fn();
  vivedAPI.addObserver(observer);

  return { vivedAPI, observer };
}

describe('Vived API Entity', () => {
  it('Forms the endpoint for production', () => {
    const { vivedAPI } = makeTestRig();
    vivedAPI.baseUrl = 'https://api.vivedlearning.com';

    const endpoint = vivedAPI.getEndpointURL('anEndpoint');

    expect(endpoint.hostname).toEqual('api.vivedlearning.com');
    expect(endpoint.pathname).toEqual('/anEndpoint');
  });

  it('Forms the endpoint for staging', () => {
    const { vivedAPI } = makeTestRig();
    vivedAPI.baseUrl = 'https://api-staging.vivedlearning.com';

    const endpoint = vivedAPI.getEndpointURL('anEndPoint');

    expect(endpoint.hostname).toEqual('api-staging.vivedlearning.com');
    expect(endpoint.pathname).toEqual('/anEndPoint');
  });

  it('Forms the endpoint for development', () => {
    const { vivedAPI } = makeTestRig();
    vivedAPI.baseUrl = 'https://api-test.vivedlearning.com';

    const endpoint = vivedAPI.getEndpointURL('anEndPoint');

    expect(endpoint.hostname).toEqual('api-test.vivedlearning.com');
    expect(endpoint.pathname).toEqual('/anEndPoint');
  });

  it('Forms the endpoint for local', () => {
    const { vivedAPI } = makeTestRig();
    vivedAPI.baseUrl = 'https://localhost:3001';

    const endpoint = vivedAPI.getEndpointURL('anEndPoint');

    expect(endpoint.hostname).toEqual('localhost');
    expect(endpoint.pathname).toEqual('/anEndPoint');
  });

  it('Sets the userAuthToken', () => {
    const { vivedAPI } = makeTestRig();

    expect(vivedAPI.userAuthToken).toBeUndefined();

    vivedAPI.userAuthToken = 'someToken';

    expect(vivedAPI.userAuthToken).toEqual('someToken');
  });

  it('Should notify observers when the userAuthToken is set', () => {
    const { vivedAPI, observer } = makeTestRig();

    vivedAPI.userAuthToken = 'someToken';
    expect(observer).toBeCalled();
  });

  it('Only notifies if the userAuthToken changes', () => {
    const { vivedAPI, observer } = makeTestRig();
    vivedAPI.userAuthToken = 'someToken';

    observer.mockClear();

    vivedAPI.userAuthToken = 'someToken';
    vivedAPI.userAuthToken = 'someToken';
    vivedAPI.userAuthToken = 'someToken';

    expect(observer).not.toBeCalled();
  });

  it('Clear the userAuthToken', () => {
    const { vivedAPI, observer } = makeTestRig();
    vivedAPI.userAuthToken = 'someToken';

    observer.mockClear();

    vivedAPI.clearAuthToken();

    expect(vivedAPI.userAuthToken).toBeUndefined();
    expect(observer).toBeCalled();
  });

  it('Does not notify if there is nothing to clear', () => {
    const { vivedAPI, observer } = makeTestRig();
    vivedAPI.clearAuthToken();

    observer.mockClear();

    vivedAPI.clearAuthToken();
    vivedAPI.clearAuthToken();
    vivedAPI.clearAuthToken();

    expect(observer).not.toBeCalled();
  });

  it('Rejects if fetch asset file is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.fetchAssetFile('asset1')).rejects.toEqual(
      new Error(`API function fetchAssetFile has not been injected`),
    );
  });

  it('Rejects if fetch asset meta is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.fetchAssetMeta('asset1')).rejects.toEqual(
      new Error(`API function fetchAssetMeta has not been injected`),
    );
  });

  it('Rejects if fetch asset for owner is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.fetchAssetsForOwner('asset1')).rejects.toEqual(
      new Error(`API function fetchAssetsForOwner has not been injected`),
    );
  });

  it('Rejects if set asset archived is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.setAssetArchived('asset1', true)).rejects.toEqual(
      new Error(`API function setAssetArchived has not been injected`),
    );
  });

  it('Rejects if post asset meta is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(
      vivedAPI.postAssetMeta({
        ownerId: 'ownerId',
        archived: false,
        description: 'a description',
        filename: 'file.name',
        fileURL: 'www.your.mom',
        id: 'asset1',
        linkedAssets: [],
        name: 'Asset 1',
      }),
    ).rejects.toEqual(new Error(`API function postAssetMeta has not been injected`));
  });

  it('Rejects if create new asset is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(
      vivedAPI.createNewAsset({
        ownerID: 'anOwner',
        description: 'a description',
        file: new File([], 'some.filename'),
        name: 'Asset 1',
      }),
    ).rejects.toEqual(new Error(`API function createNewAsset has not been injected`));
  });

  it('Rejects if post new asset file is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.postAssetFile('asset1', new File([], 'some.filename'))).rejects.toEqual(
      new Error(`API function postAssetFile has not been injected`),
    );
  });

  it('Rejects if delete Asset is called before it is injected', async () => {
    const { vivedAPI } = makeTestRig();

    await expect(vivedAPI.deleteAsset('asset1')).rejects.toEqual(
      new Error(`API function deleteAsset has not been injected`),
    );
  });

  it('Rejects if fetch app is called before it is injected', async () => {
    const api = makeVivedAPI();

    await expect(api.fetchApp('appID', '1.2.3')).rejects.toEqual(
      new Error(`API function fetchApp has not been injected`),
    );
  });

  it('Allows the fetchChannelAppIds to be injected', async () => {
    const api = makeVivedAPI();
    const mockFetchApp = jest.fn();
    mockFetchApp.mockReturnValueOnce({
      interfaceVersion: '1.2.3',
      assetFolderURL: 'url.to.assets',
      entrypoints: ['entry1', 'entry2'],
    });

    api.fetchApp = mockFetchApp;

    const apps = await api.fetchApp('appID', '1.2.3');

    expect(mockFetchApp).toBeCalledWith('appID', '1.2.3');
    expect(apps).toEqual({
      interfaceVersion: '1.2.3',
      assetFolderURL: 'url.to.assets',
      entrypoints: ['entry1', 'entry2'],
    });
  });

  it('Rejects if update asset is called before it is injected', async () => {
    const api = makeVivedAPI();

    await expect(
      api.updateAsset({
        id: 'assetID',
        name: 'asset name',
        description: 'asset description',
        archived: true,
      }),
    ).rejects.toEqual(new Error(`API function updateAsset has not been injected`));
  });
});
