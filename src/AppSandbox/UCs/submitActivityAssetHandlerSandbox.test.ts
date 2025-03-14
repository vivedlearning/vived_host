import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { makeMockNewAssetUC, MockNewAssetUC, NewAssetUC } from "../../Assets";
import { SubmitActivityAssetAction } from "../../Handler/UCs/SubmitActivityAssetHandler";
import { AppSandboxEntity, makeAppSandboxEntity } from "../Entities";
import { makeSubmitActivityAssetHandlerSandbox } from "./submitActivityAssetHandlerSandbox";

describe("submitActivityAssetHandler", () => {
  let appObjects: AppObjectRepo;
  let sandbox: AppSandboxEntity;
  let newAssetUC: MockNewAssetUC;
  let testFile: File;
  let handler: SubmitActivityAssetAction;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    sandbox = makeAppSandboxEntity(appObjects.getOrCreate("AppSandbox"));

    sandbox.mockActivityID = "activity";

    newAssetUC = makeMockNewAssetUC(appObjects);
    newAssetUC.create.mockResolvedValue("asset123");

    testFile = new File(["dummy content"], "test.png", {
      type: "image/png"
    });

    handler = makeSubmitActivityAssetHandlerSandbox(appObjects);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call callback is the new asset id", (done) => {
    const callback = (id: string | undefined) => {
      expect(id).toBe("asset123");
      done();
    };

    handler(testFile, callback);
  });

  it("should submit error when activity ID is empty", (done) => {
    sandbox.mockActivityID = "";
    const errorSpy = jest.spyOn(appObjects, "submitError");

    const callback = (id: string | undefined) => {
      expect(id).toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith(
        "makeSubmitActivityAssetHandlerSandbox",
        "No activity ID found"
      );
      done();
    };

    handler(testFile, callback);
  });

  it("should submit error when NewAssetUC is missing", (done) => {
    jest.spyOn(NewAssetUC, "get").mockReturnValue(undefined);
    const errorSpy = jest.spyOn(appObjects, "submitError");

    const callback = (id: string | undefined) => {
      expect(id).toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith(
        "makeSubmitActivityAssetHandlerSandbox",
        "Unable to find NewAssetUC"
      );
      done();
    };

    handler(testFile, callback);
  });
});
