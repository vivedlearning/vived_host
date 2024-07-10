import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { DialogAlertDTO, DialogQueue } from "../../Dialog";
import { PatchAssetFileUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";

export interface UpdateAssetMetaDTO {
  name: string;
  description: string;
  archived: boolean;
}

export abstract class UpdateAssetFileUC extends HostAppObjectUC {
  static type = "UpdateAssetFileUC";

  abstract updateFile(file: File): Promise<void>;

  static get(
    assetID: string,
    appObjects: HostAppObjectRepo
  ): UpdateAssetFileUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "UpdateAssetFileUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<UpdateAssetFileUC>(
      UpdateAssetFileUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "UpdateAssetFileUC.get",
        "App Object does not have UpdateAssetFileUC"
      );
      return undefined;
    }

    return uc;
  }
}

export function makeUpdateAssetFileUC(
  appObject: HostAppObject
): UpdateAssetFileUC {
  return new UpdateAssetFileUCImp(appObject);
}

class UpdateAssetFileUCImp extends UpdateAssetFileUC {
  private asset?: AssetEntity;

  private get patchAssetFile() {
    return this.getCachedSingleton<PatchAssetFileUC>(PatchAssetFileUC.type)
      ?.doPatch;
  }

  private get dialogQueue() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  updateFile = (file: File): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const patchAssetFile = this.patchAssetFile;
    const dialogQueue = this.dialogQueue;
    if (!patchAssetFile || !dialogQueue) {
      return Promise.reject();
    }

    const spinnerDialog = dialogQueue.spinnerDialogFactory({
      title: "Asset File",
      message: "Updating asset's file..."
    });
    if (spinnerDialog) dialogQueue.submitDialog(spinnerDialog);

    return new Promise((resolve, reject) => {
      patchAssetFile(asset.id, file)
        .then((newFilename) => {
          asset.setFile(file);
          asset.filename = newFilename;

          spinnerDialog?.close();
          resolve();
        })
        .catch((e) => {
          this.error("Patch asset file error: " + e.message);
          spinnerDialog?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when updating the asset's file. Check the console. ${e.message}`,
            title: "Update Asset File Error",
          };
          const confirmDialog = dialogQueue.alertDialogFactory(dialogDTO);
          if (confirmDialog) dialogQueue.submitDialog(confirmDialog);
          resolve();
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, UpdateAssetFileUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
