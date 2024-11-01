import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockNewAppAssetUC } from "../Mocks/MockNewAppAsset";
import { NewAppAssetDTO } from "../UCs";
import { newAppAsset } from "./newAppAsset";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockNewAsset = makeMockNewAppAssetUC(appObjects);

  const mockFile = new File([], "a.file");
  const appAssetDTO: NewAppAssetDTO = {
    description: "New Asset Description",
    file: mockFile,
    name: "New Asset Name"
  };

  return {
    appAssetDTO,
    appObjects,
    mockNewAsset
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", async () => {
    const { appObjects, appAssetDTO, mockNewAsset } = makeTestRig();

    await newAppAsset(appAssetDTO, appObjects);

    const expectedData: NewAppAssetDTO = {
      description: appAssetDTO.description,
      name: appAssetDTO.name,
      file: appAssetDTO.file
    };

    expect(mockNewAsset.create).toBeCalledWith(expectedData);
  });
});
