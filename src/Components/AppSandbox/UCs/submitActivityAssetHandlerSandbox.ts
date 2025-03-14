import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "..";
import { NewAssetDto, NewAssetUC } from "../../Assets";
import { SubmitActivityAssetAction } from "../../Handler/UCs/SubmitActivityAssetHandler";

export function makeSubmitActivityAssetHandlerSandbox(
  appObjects: HostAppObjectRepo
): SubmitActivityAssetAction {
  return function (
    assetFile: File,
    callback: (assetID: string | undefined) => void
  ): void {
    const sandbox = AppSandboxEntity.get(appObjects);
    if (!sandbox) {
      appObjects.submitError(
        "makeSubmitActivityAssetHandlerSandbox",
        "Unable to find AppSandboxEntity"
      );
      callback(undefined);
      return;
    }

    if (!sandbox.mockActivityID) {
      appObjects.submitError(
        "makeSubmitActivityAssetHandlerSandbox",
        "No activity ID found"
      );
      callback(undefined);
      return;
    }

    const ownerID: string = sandbox.mockActivityID;

    const newAssetData: NewAssetDto = {
      name: "Activity Asset",
      description: "Asset for activity " + ownerID,
      file: assetFile,
      owner: ownerID
    };

    const newAssetUC = NewAssetUC.get(appObjects);
    if (!newAssetUC) {
      appObjects.submitError(
        "makeSubmitActivityAssetHandlerSandbox",
        "Unable to find NewAssetUC"
      );
      callback(undefined);
      return;
    }

    newAssetUC.create(newAssetData).then((assetID) => {
      callback(assetID);
    });
  };
}
