import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { DialogAlertDTO, DialogQueue } from "../../Dialog";
import { PatchAssetIsArchivedUC } from "../../VivedAPI";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetEntity } from "../Entities/AssetEntity";

export abstract class ArchiveAssetUC extends HostAppObjectUC {
  static type = "ArchiveAssetUC";

  abstract setArchived(archived: boolean): Promise<void>;

  static get(
    assetID: string,
    appObjects: HostAppObjectRepo
  ): ArchiveAssetUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "ArchiveAssetUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<ArchiveAssetUC>(ArchiveAssetUC.type);
    if (!uc) {
      appObjects.submitWarning(
        "ArchiveAssetUC.get",
        "App Object does not have ArchiveAssetUC"
      );
      return undefined;
    }

    return uc;
  }
}

export function makeArchiveAssetUC(appObject: HostAppObject): ArchiveAssetUC {
  return new ArchiveAssetUCImp(appObject);
}

class ArchiveAssetUCImp extends ArchiveAssetUC {
  private asset?: AssetEntity;

  private get patchAssetIsArchived() {
    return this.getCachedSingleton<PatchAssetIsArchivedUC>(
      PatchAssetIsArchivedUC.type
    )?.doPatch;
  }

  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  private get dialogQueue() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  setArchived = (archived: boolean): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    if (asset.archived === archived) {
      return Promise.resolve();
    }

    const patchAssetIsArchived = this.patchAssetIsArchived;
    const dialogQueue = this.dialogQueue;
    if (!patchAssetIsArchived || !dialogQueue) {
      return Promise.reject();
    }

    const title = archived ? "Archiving Asset" : "Unarchiving Asset";
    const spinner = dialogQueue.spinnerDialogFactory({
      title,
      message: "Updating asset's archived flag..."
    });
    if (!spinner) {
      return Promise.reject();
    }

    dialogQueue.submitDialog(spinner);

    return new Promise((resolve, reject) => {
      patchAssetIsArchived(asset.id, archived)
        .then(() => {
          asset.archived = archived;

          if (this.appAssets && this.appAssets.has(asset.id)) {
            this.appAssets.notifyOnChange();
          }
          spinner?.close();
          resolve();
        })
        .catch((e) => {
          this.error("Archive asset error: " + e.message);
          spinner.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when setting the asset's archived flag. Check the console. ${e.message}`,
            title: "Archive Asset Error",
          };
          const confirmDialog = dialogQueue.alertDialogFactory(dialogDTO);
          if (confirmDialog) dialogQueue.submitDialog(confirmDialog);
          resolve();
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, ArchiveAssetUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
