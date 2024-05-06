import { AssetDTO, NewAssetDTO } from '../../../Entities';
import { HostAppObjectRepo, makeHostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity, makeAssetEntity } from './AssetEntity';
import { APIComms, AssetRepo, makeAssetRepo, NO_API_COMMS_ERROR, NO_ASSET_ERROR } from './AssetRepo';

function makeAssetFactory(appObjects: HostAppObjectRepo) {
  return function (id: string): AssetEntity {
    const ao = appObjects.getOrCreate(id);
    return makeAssetEntity(ao);
  };
}

function makeTestRig() {
  const appObjectRepo = makeHostAppObjectRepo();
  const repoAO = appObjectRepo.getOrCreate('AssetRepo');
  const spyRegisterSingleton = jest.spyOn(appObjectRepo, 'registerSingleton');

  const assetRepo = makeAssetRepo(repoAO);
  assetRepo.assetFactory = makeAssetFactory(appObjectRepo);

  const mockedComms = makeMockComms(appObjectRepo);
  assetRepo.apiComms = mockedComms;

  return { assetRepo, mockedComms, appObjectRepo, spyRegisterSingleton };
}

function makeMockComms(appObjects: HostAppObjectRepo): APIComms {
  const mockFileFetcher = jest.fn();
  mockFileFetcher.mockResolvedValue(new File([], 'a.file'));

  const mockMetaFetcher = jest.fn();
  const asset: AssetDTO = {
    description: 'Asset Disc',
    id: 'assetID',
    name: 'Asset Name',
    archived: false,
    filename: 'someFile.file',
    fileURL: '',
    linkedAssets: [],
    ownerId: '',
  };
  mockMetaFetcher.mockResolvedValue(asset);

  const mockOwnerAssetsFetcher = jest.fn();
  const assets: AssetDTO[] = [
    {
      description: 'Asset 1 desc',
      id: 'asset1',
      name: 'Asset 1 name',
      archived: false,
      filename: 'someFile1.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    },
    {
      description: 'Asset 2 desc',
      id: 'asset2',
      name: 'Asset 2 name',
      archived: false,
      filename: 'someFile2.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    },
  ];
  mockOwnerAssetsFetcher.mockResolvedValue(assets);

  const mockPostArchive = jest.fn().mockImplementationOnce(() => Promise.resolve());

  const mockPostMeta = jest.fn().mockImplementationOnce(() => Promise.resolve());

  const ao = appObjects.getOrCreate('aNewAsset');
  const newAsset = makeAssetEntity(ao);
  const mockPostNewAsset = jest.fn();
  mockPostNewAsset.mockResolvedValue(newAsset);

  const mockPostAssetFile = jest.fn().mockImplementationOnce(() => Promise.resolve());

  const mockDeleteAsset = jest.fn().mockImplementationOnce(() => Promise.resolve());

  return {
    getAssetFile: mockFileFetcher,
    getAssetMeta: mockMetaFetcher,
    getAssetsForOwner: mockOwnerAssetsFetcher,
    updateArchiveAsset: mockPostArchive,
    updateAssetMeta: mockPostMeta,
    createNewAsset: mockPostNewAsset,
    deleteAsset: mockDeleteAsset,
    updateAssetFile: mockPostAssetFile,
    updateAsset: jest.fn(),
  };
}

describe('Asset Repository', () => {
  it('Rejects when getting asset meta and no comms have been injected', () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    expect.assertions(1);
    return expect(assetRepo.getAsset('asset1')).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Fetches a asset meta the first time it is requested', async () => {
    const { assetRepo } = makeTestRig();

    const assetData: AssetDTO = {
      description: 'Asset Disc',
      id: 'assetID',
      name: 'Asset Name',
      archived: false,
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    const asset = await assetRepo.getAsset('asset1');

    expect(asset.id).toEqual(assetData.id);
    expect(asset.description).toEqual(assetData.description);
    expect(asset.name).toEqual(assetData.name);
    expect(asset.archived).toEqual(assetData.archived);
    expect(asset.filename).toEqual('someFile.file');
  });

  it('Asset metas are stored for second gets', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    await assetRepo.getAsset('asset1');

    const mockGetAssetMeta = mockedComms.getAssetMeta as jest.Mock<any, any>;

    mockGetAssetMeta.mockClear();

    await assetRepo.getAsset('asset1');

    expect(mockGetAssetMeta).not.toBeCalled();
  });

  it('Passes the reject up from the getter', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    mockedComms.getAssetMeta = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    expect.assertions(1);
    return expect(assetRepo.getAsset('asset1')).rejects.toEqual(new Error('Post Error'));
  });

  it('Rejects when getting an asset blob and no blob fetcher has been injected', () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    expect.assertions(1);
    return expect(assetRepo.getAssetBlobURL('asset1')).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Fetches as asset blob the first time it is requested', async () => {
    const { assetRepo } = makeTestRig();

    URL.createObjectURL = jest.fn().mockReturnValue('www.blob.url');

    expect.assertions(1);
    return expect(assetRepo.getAssetBlobURL('asset1')).resolves.toBe('www.blob.url');
  });

  it('Passes the reject up from the getter', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    mockedComms.getAssetFile = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    expect.assertions(1);
    return expect(assetRepo.getAssetBlobURL('asset1')).rejects.toEqual(new Error('Post Error'));
  });

  it('Asset blobs are stored for second gets', async () => {
    const { assetRepo, mockedComms } = makeTestRig();
    URL.createObjectURL = jest.fn().mockReturnValue('www.aURL.com');

    await assetRepo.getAssetBlobURL('asset1');

    const mockGetAssetBlob = mockedComms.getAssetFile as jest.Mock<any, any>;
    mockGetAssetBlob.mockClear();

    await assetRepo.getAssetBlobURL('asset1');

    expect(mockGetAssetBlob).not.toBeCalled();
  });

  it('Fetches the assets for an owner rejects if the fetcher has not been injected', () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    expect.assertions(1);
    return expect(assetRepo.getAssetsForOwner('ownerID')).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Fetches the assets for an owner', async () => {
    const { assetRepo } = makeTestRig();

    const returnedAssets = await assetRepo.getAssetsForOwner('owner1');

    expect(returnedAssets).toHaveLength(2);
    expect(returnedAssets[0].id).toEqual('asset1');
    expect(returnedAssets[0].name).toEqual('Asset 1 name');
    expect(returnedAssets[0].description).toEqual('Asset 1 desc');
    expect(returnedAssets[0].archived).toEqual(false);
    expect(returnedAssets[0].filename).toEqual('someFile1.file');

    expect(returnedAssets[1].id).toEqual('asset2');
  });

  it('Owner asset metas are stored for second gets', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    await assetRepo.getAssetsForOwner('owner1');

    const mockGetAssetMeta = mockedComms.getAssetMeta as jest.Mock<any, any>;

    await assetRepo.getAsset('asset1');
    await assetRepo.getAsset('asset2');

    expect(mockGetAssetMeta).not.toBeCalled();
  });

  it('Archiving an asset rejects if the poster has not been injected', async () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    expect.assertions(1);
    return expect(assetRepo.setAssetArchived('asset1', true)).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Rejects if trying to archive an unknown asset', () => {
    const { assetRepo } = makeTestRig();

    expect.assertions(1);
    return expect(assetRepo.setAssetArchived('someOtherAsset', true)).rejects.toEqual(NO_ASSET_ERROR);
  });

  it('Posts archive as expected', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    const mockArchivePost = mockedComms.updateArchiveAsset as jest.Mock<any, any>;

    await assetRepo.getAsset('asset1');
    await assetRepo.setAssetArchived('asset1', true);
    expect(mockArchivePost).toBeCalledWith('asset1', true);
  });

  it('Sets the asset as archived', async () => {
    const { assetRepo } = makeTestRig();

    const initialMeta = await assetRepo.getAsset('asset1');
    expect(initialMeta.archived).toEqual(false);

    await assetRepo.setAssetArchived('asset1', true);
    const finalMeta = await assetRepo.getAsset('asset1');
    expect(finalMeta.archived).toEqual(true);
  });

  it('Does not post if there is no change to the archived flag', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    const mockArchivePost = mockedComms.updateArchiveAsset as jest.Mock<any, any>;

    const initialMeta = await assetRepo.getAsset('asset1');
    expect(initialMeta.archived).toEqual(false);

    await assetRepo.setAssetArchived('asset1', false);
    expect(mockArchivePost).not.toBeCalled();
  });

  it('Passes the reject up from the poster', async () => {
    const { assetRepo, mockedComms } = makeTestRig();

    mockedComms.updateArchiveAsset = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    const initialMeta = await assetRepo.getAsset('asset1');
    expect(initialMeta.archived).toEqual(false);

    expect.assertions(2);
    return expect(assetRepo.setAssetArchived('asset1', true)).rejects.toEqual(new Error('Post Error'));
  });

  it('Adds an asset', async () => {
    const { assetRepo, appObjectRepo } = makeTestRig();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    const returnedAsset = await assetRepo.getAsset('asset1');
    expect(returnedAsset).toEqual(asset);
  });

  it("Checks for an asset", ()=>{
    const { assetRepo, appObjectRepo } = makeTestRig();

    expect(assetRepo.hasAsset("asset1")).toEqual(false);

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'))
    assetRepo.addAsset(asset);

    expect(assetRepo.hasAsset("asset1")).toEqual(true);
  })

  it('Checks for a fetched asset', () => {
    const { assetRepo, appObjectRepo } = makeTestRig();

    expect(assetRepo.hasFetchedAsset('asset1')).toEqual(false);

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    expect(assetRepo.hasFetchedAsset('asset1')).toEqual(true);
  });

  it('Gets a fetched asset', () => {
    const { assetRepo, appObjectRepo } = makeTestRig();

    expect(assetRepo.getFetchedAsset('asset1')).toBeUndefined();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    expect(assetRepo.getFetchedAsset('asset1')).toEqual(asset);
  });

  it('Editing an asset rejects if the poster has not been injected', async () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'asset1',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    expect.assertions(1);
    return expect(assetRepo.updateAssetMeta(data)).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Posts the data to the edit asset meta poster', async () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();
    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    const mockPostMeta = mockedComms.updateAssetMeta as jest.Mock<any, any>;

    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'asset1',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    await assetRepo.updateAssetMeta(data);

    expect(mockPostMeta).toBeCalledWith(data);
  });

  it('Rejects updating an asset if the asset does not exist', () => {
    const { assetRepo } = makeTestRig();
    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'someAssetID',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    expect.assertions(1);
    return expect(assetRepo.updateAssetMeta(data)).rejects.toEqual(NO_ASSET_ERROR);
  });

  it("Updates the asset's meta", async () => {
    const { assetRepo, appObjectRepo } = makeTestRig();
    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'asset1',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    await assetRepo.updateAssetMeta(data);

    expect(asset.name).toEqual('Asset 1 name');
    expect(asset.archived).toEqual(true);
    expect(asset.description).toEqual('A description');
  });

  it('Does not post if there is no change in the asset meta', async () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();
    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    asset.name = 'Asset 1 name';
    asset.description = 'A description';
    asset.archived = true;
    assetRepo.addAsset(asset);

    const mockPostMeta = mockedComms.updateAssetMeta as jest.Mock<any, any>;

    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'asset1',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    await assetRepo.updateAssetMeta(data);

    expect(mockPostMeta).not.toBeCalled();
  });

  it('Rejects if something goes wrong with the poster', () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();
    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    mockedComms.updateAssetMeta = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    const data: AssetDTO = {
      archived: true,
      description: 'A description',
      id: 'asset1',
      name: 'Asset 1 name',
      filename: 'someFile.file',
      fileURL: '',
      linkedAssets: [],
      ownerId: '',
    };

    expect.assertions(1);
    return expect(assetRepo.updateAssetMeta(data)).rejects.toEqual(new Error('Post Error'));
  });

  it('Rejects when trying to add an asset and no comms have been injected', async () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    const newAssetData: NewAssetDTO = {
      description: 'a new asset',
      file: new File([], ''),
      name: 'New Asset',
      ownerID: 'onwerID',
    };

    expect.assertions(1);
    return expect(assetRepo.newAsset(newAssetData)).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Adds the asset to the lookup', async () => {
    const { assetRepo } = makeTestRig();

    const newAssetData: NewAssetDTO = {
      description: 'a new asset',
      file: new File([], ''),
      name: 'New Asset',
      ownerID: 'onwerID',
    };

    const asset = await assetRepo.newAsset(newAssetData);

    expect(assetRepo.hasFetchedAsset(asset.id)).toEqual(true);
  });

  it('Rejects if something goes wrong with the add asset post', () => {
    const { assetRepo, mockedComms } = makeTestRig();

    mockedComms.createNewAsset = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    const newAssetData: NewAssetDTO = {
      description: 'a new asset',
      file: new File([], ''),
      name: 'New Asset',
      ownerID: 'onwerID',
    };

    expect.assertions(1);
    return expect(assetRepo.newAsset(newAssetData)).rejects.toEqual(new Error('Post Error'));
  });

  it('Rejects when trying to post a new asset file and no comms have been injected', async () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    const newFile = new File([], '');

    expect.assertions(1);
    return expect(assetRepo.updateAssetFile('asset1', newFile)).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Rejects if the asset has not been fetched', () => {
    const { assetRepo } = makeTestRig();

    const newFile = new File([], '');

    expect.assertions(1);
    return expect(assetRepo.updateAssetFile('asset1', newFile)).rejects.toEqual(NO_ASSET_ERROR);
  });

  it.todo(
    'Calls the api when a new file is posted for an asset',
    // , async () => {
    //   const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();
    //   const newFile = new File([], '');

    //   const mockPostNewFile = jest.fn().mockResolvedValue(() => {});
    //   mockedComms.updateAssetFile = mockPostNewFile;

    //   const asset = makeAsset(appObjectRepo.getOrCreate('asset1'));
    //   assetRepo.addAsset(asset);

    //   await assetRepo.updateAssetFile('asset1', newFile);

    //   expect(mockPostNewFile).toBeCalledWith('asset1', newFile);
    // }
  );

  it("Updates the asset's file", async () => {
    const { assetRepo, appObjectRepo } = makeTestRig();
    const existingFile = new File([], 'anOld.file');
    const newFile = new File([], 'aNew.file');

    URL.createObjectURL = jest.fn().mockReturnValue('www.aURL.com');

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);
    asset.setFile(existingFile);

    await assetRepo.updateAssetFile('asset1', newFile);

    expect(asset.file).toEqual(newFile);
  });

  it('Rejects if the post rejects', () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();

    const newFile = new File([], '');
    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));

    mockedComms.updateAssetFile = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    expect.assertions(1);
    return expect(assetRepo.updateAssetFile('asset1', newFile)).rejects.toEqual(
      new Error('Unable to find asset by id'),
    );
  });

  it('Rejects when trying to delete an asset and no comms have been injected', async () => {
    const appObjectRepo = makeHostAppObjectRepo();
    const repoAO = appObjectRepo.getOrCreate('AssetRepo');
    const assetRepo = makeAssetRepo(repoAO);

    expect.assertions(1);
    return expect(assetRepo.deleteAsset('asset1')).rejects.toEqual(NO_API_COMMS_ERROR);
  });

  it('Rejects if the asset has not been fetched', () => {
    const { assetRepo } = makeTestRig();

    expect.assertions(1);
    return expect(assetRepo.deleteAsset('asset1')).rejects.toEqual(NO_ASSET_ERROR);
  });

  it('Calls the api when an asset is deleted', async () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();

    const mockDelete = jest.fn().mockResolvedValue(() => {});
    mockedComms.deleteAsset = mockDelete;

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    await assetRepo.deleteAsset('asset1');

    expect(mockDelete).toBeCalledWith('asset1');
  });

  it('Removed the asset from the local lookup', async () => {
    const { assetRepo, appObjectRepo } = makeTestRig();

    const asset = makeAssetEntity(appObjectRepo.getOrCreate('asset1'));
    assetRepo.addAsset(asset);

    await assetRepo.deleteAsset('asset1');

    expect(assetRepo.hasFetchedAsset('asset1')).toEqual(false);
  });

  it('Rejects if the post rejects', () => {
    const { assetRepo, mockedComms, appObjectRepo } = makeTestRig();

    makeAssetEntity(appObjectRepo.getOrCreate('asset1'));

    mockedComms.deleteAsset = jest.fn().mockImplementationOnce(() => Promise.reject(new Error('Post Error')));

    expect.assertions(1);
    return expect(assetRepo.deleteAsset('asset1')).rejects.toEqual(new Error('Unable to find asset by id'));
  });

  it('Gets the singleton', () => {
    const { assetRepo, appObjectRepo } = makeTestRig();
    expect(AssetRepo.get(appObjectRepo)).toEqual(assetRepo);
  });

  it('Registers as the singleton', () => {
    const { assetRepo, spyRegisterSingleton } = makeTestRig();
    expect(spyRegisterSingleton).toBeCalledWith(assetRepo);
  });
});
