import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeAppSandboxEntity,
  SandboxState
} from "../../AppSandbox/Entities/AppSandboxEntity";
import { SpinnerDialogEntity } from "../../Dialog/Entities";
import { makeMockMakeAlertDialogUC } from "../../Dialog/Mocks/MockMakeAlertDialogUC";
import { makeMockMakeSpinnerDialogUC } from "../../Dialog/Mocks/MockMakeSpinnerDialogUC";
import { NewAssetDTO } from "../../VivedAPI/UCs/PostNewAssetUC";
import { makeMockPostNewAssetUC } from "../../VivedAPI/Mocks/MockPostNewAssetUC";
import { makeAppAssets, makeAssetEntity, makeAssetRepo } from "../Entities";
import {
  makeNewAppAssetUC,
  NewAppAssetDTO,
  NewAppAssetUC
} from "./NewAppAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("anAppID"));

  const mockPost = makeMockPostNewAssetUC(appObjects);
  mockPost.doPost.mockResolvedValue({
    id: "newAssetID",
    filename: "newAssetFile.name"
  });

  URL.createObjectURL = jest.fn();

  const ao = appObjects.getOrCreate("ao");
  const appAssets = makeAppAssets(ao);
  const assetRepo = makeAssetRepo(ao);
  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  const spinner = new SpinnerDialogEntity(
    {
      message: "msg",
      title: "title"
    },
    appObjects.getOrCreate("Spinner")
  );
  const mockMakeSpinner = makeMockMakeSpinnerDialogUC(appObjects);
  mockMakeSpinner.make.mockReturnValue(spinner);

  const mockMakeAlert = makeMockMakeAlertDialogUC(appObjects);

  const uc = makeNewAppAssetUC(ao);

  return {
    uc,
    appObjects,
    singletonSpy,
    mockPost,
    sandbox,
    ao,
    appAssets,
    assetRepo,
    spinner,
    mockMakeAlert,
    mockMakeSpinner
  };
}

function makeDTO(): NewAppAssetDTO {
  return {
    description: "some description",
    file: new File([], "filename.file"),
    name: "some name"
  };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(NewAppAssetUC.get(appObjects)).toEqual(uc);
  });

  it("Adds the asset to the App Assets", async () => {
    const { appAssets, uc } = makeTestRig();

    expect(appAssets.has("newAssetID")).toEqual(false);

    await uc.create({
      description: "some description",
      file: new File([], "filename.file"),
      name: "some name"
    });

    expect(appAssets.has("newAssetID")).toEqual(true);
  });

  it("Sets the sandbox stat", async () => {
    const { uc, sandbox } = makeTestRig();

    sandbox.state = SandboxState.PLAYING;

    await uc.create({
      description: "some description",
      file: new File([], "filename.file"),
      name: "some name"
    });

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });

  it("Forms the post DTO as expected", async () => {
    const { uc, mockPost } = makeTestRig();

    const mockFile = new File([], "filename.file");

    const newAppAssetDTO = {
      description: "some description",
      file: mockFile,
      name: "some name"
    };

    await uc.create(newAppAssetDTO);

    const mockPostDTO = mockPost.doPost.mock.calls[0][0] as NewAssetDTO;

    expect(mockPostDTO.description).toEqual("some description");
    expect(mockPostDTO.ownerID).toEqual("anAppID");
    expect(mockPostDTO.name).toEqual("some name");
    expect(mockPostDTO.file).toEqual(mockFile);
  });

  it("Errors if the post rejects", async () => {
    const { uc, mockPost } = makeTestRig();

    uc.error = jest.fn();

    mockPost.doPost.mockRejectedValue(new Error("Some Post Error"));

    await uc.create(makeDTO());

    expect(uc.error).toBeCalled();
  });

  it("Shows a spinner", () => {
    const { uc, mockMakeSpinner } = makeTestRig();

    const dto = makeDTO();

    uc.create(dto);

    expect(mockMakeSpinner.make).toBeCalled();
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();
    const dto = makeDTO();

    await uc.create(dto);

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, mockPost, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockPost.doPost.mockRejectedValue(new Error("Some Post Error"));

    await uc.create(makeDTO());

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockPost, spinner } = makeTestRig();
    spinner.close = jest.fn();
    uc.error = jest.fn();
    mockPost.doPost.mockRejectedValue(new Error("Some Post Error"));

    await uc.create(makeDTO());

    expect(spinner.close).toBeCalled();
  });

  it("Adds the asset to the asset repo", async () => {
    const { uc, assetRepo, appAssets } = makeTestRig();

    const mockFile = new File([], "filename.file");

    const newAppAssetDTO = {
      description: "some description",
      file: mockFile,
      name: "some name"
    };

    expect(appAssets.getAll()).toHaveLength(0);

    await uc.create(newAppAssetDTO);

    expect(appAssets.getAll()).toHaveLength(1);
    const newAssetID = appAssets.getAll()[0];

    expect(assetRepo.has(newAssetID)).toEqual(true);
  });

  it("Sets up the new asset in the repo", async () => {
    const { uc, assetRepo, appAssets } = makeTestRig();

    const mockFile = new File([], "filename.file");

    const newAppAssetDTO = {
      description: "some description",
      file: mockFile,
      name: "some name"
    };

    expect(appAssets.getAll()).toHaveLength(0);

    await uc.create(newAppAssetDTO);

    expect(appAssets.getAll()).toHaveLength(1);
    const newAssetID = appAssets.getAll()[0];

    const repoAsset = assetRepo.get(newAssetID);

    expect(repoAsset?.name).toEqual("some name");
    expect(repoAsset?.description).toEqual("some description");
    expect(repoAsset?.file).toEqual(mockFile);
    expect(repoAsset?.filename).toEqual("newAssetFile.name");
  });
});
