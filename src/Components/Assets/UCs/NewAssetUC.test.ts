import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockPostNewAssetUC } from "../../VivedAPI/Mocks/MockPostNewAssetUC";
import { NewAssetApiDto } from "../../VivedAPI/UCs/PostNewAssetUC";
import { makeAssetEntity, makeAssetRepo } from "../Entities";
import { makeNewAssetUC, NewAssetDto, NewAssetUC } from "./NewAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const mockPost = makeMockPostNewAssetUC(appObjects);
  mockPost.doPost.mockResolvedValue({
    id: "newAssetID",
    filename: "newAssetFile.name"
  });

  URL.createObjectURL = jest.fn();

  const ao = appObjects.getOrCreate("ao");
  const assetRepo = makeAssetRepo(ao);
  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  const uc = makeNewAssetUC(ao);

  return {
    uc,
    appObjects,
    singletonSpy,
    mockPost,
    ao,
    assetRepo
  };
}

function makeDTO(): NewAssetDto {
  return {
    description: "some description",
    file: new File([], "filename.file"),
    name: "some name",
    owner: "anOwnderID"
  };
}

describe("New Asset UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();
    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();
    expect(NewAssetUC.get(appObjects)).toEqual(uc);
  });

  it("Forms the post DTO as expected", async () => {
    const { uc, mockPost } = makeTestRig();
    const mockFile = new File([], "filename.file");
    const newAppAssetDTO: NewAssetDto = {
      description: "some description",
      file: mockFile,
      name: "some name",
      owner: "anOwnerID"
    };

    await uc.create(newAppAssetDTO);
    const mockPostDTO = mockPost.doPost.mock.calls[0][0] as NewAssetApiDto;
    expect(mockPostDTO.description).toEqual("some description");
    expect(mockPostDTO.ownerID).toEqual("anOwnerID");
    expect(mockPostDTO.name).toEqual("some name");
    expect(mockPostDTO.file).toEqual(mockFile);
  });

  it("Rejects if the post rejects", async () => {
    const { uc, mockPost } = makeTestRig();
    uc.error = jest.fn();
    mockPost.doPost.mockRejectedValue(new Error("Some Post Error"));

    await expect(uc.create(makeDTO())).rejects.toThrow("Some Post Error");
  });

  it("Adds the asset to the asset repo", async () => {
    const { uc, assetRepo } = makeTestRig();
    const mockFile = new File([], "filename.file");
    const newAppAssetDTO = {
      description: "some description",
      file: mockFile,
      name: "some name",
      owner: "anOwnerID"
    };
    const newAssetID = await uc.create(newAppAssetDTO);
    expect(assetRepo.has(newAssetID)).toEqual(true);
  });

  it("Sets up the new asset in the repo", async () => {
    const { uc, assetRepo } = makeTestRig();
    const mockFile = new File([], "filename.file");
    const newAppAssetDTO = {
      description: "some description",
      file: mockFile,
      name: "some name",
      owner: "anOwnerID"
    };
    const newAssetID = await uc.create(newAppAssetDTO);
    const repoAsset = assetRepo.get(newAssetID);
    expect(repoAsset?.name).toEqual("some name");
    expect(repoAsset?.description).toEqual("some description");
    expect(repoAsset?.file).toEqual(mockFile);
    expect(repoAsset?.filename).toEqual("newAssetFile.name");
  });

  it("Reruns the new asset ID", async () => {
    const { uc } = makeTestRig();
    const newAssetID = await uc.create(makeDTO());
    expect(newAssetID).toEqual("newAssetID");
  });
});
