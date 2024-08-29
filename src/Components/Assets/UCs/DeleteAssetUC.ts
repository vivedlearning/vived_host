import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeConfirmDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { DeleteAssetOnAPIUC } from "../../VivedAPI";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";

export abstract class DeleteAssetUC extends HostAppObjectUC {
  static type = "DeleteAssetUC";

  abstract delete(): Promise<void>;
  abstract deleteWithConfirm(): void;

  static get(
    assetID: string,
    appObjects: HostAppObjectRepo
  ): DeleteAssetUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "DeleteAssetUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<DeleteAssetUC>(DeleteAssetUC.type);
    if (!uc) {
      appObjects.submitWarning(
        "DeleteAssetUC.get",
        "App Object does not have DeleteAssetUC"
      );
      return undefined;
    }

    return uc;
  }
}

export function makeDeleteAssetUC(appObject: HostAppObject): DeleteAssetUC {
  return new DeleteAssetUCImp(appObject);
}

class DeleteAssetUCImp extends DeleteAssetUC {
  private asset?: AssetEntity;

  private get doDelete() {
    return this.getCachedSingleton<DeleteAssetOnAPIUC>(DeleteAssetOnAPIUC.type)
      ?.doDelete;
  }

  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  deleteWithConfirm = () => {
    MakeConfirmDialogUC.make(
      {
        cancelButtonLabel: "Cancel",
        confirmButtonLabel: "Delete Asset",
        message:
          "Are you sure you want to delete this asset. This cannot be undone and could affect users. Consider archiving it instead",
        title: "Delete Asset",
        onConfirm: this.delete
      },
      this.appObjects
    );
  };

  delete = (): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const doDelete = this.doDelete;
    if (!doDelete) {
      return Promise.reject();
    }

    const title = "Delete Asset";
    const spinnerDialog = MakeSpinnerDialogUC.make(
      {
        title,
        message: "Deleting asset..."
      },
      this.appObjects
    );

    return new Promise((resolve) => {
      doDelete(asset.id)
        .then(() => {
          if (this.appAssets && this.appAssets.has(asset.id)) {
            this.appAssets.remove(asset.id);
          }

          if (this.assetRepo && this.assetRepo.has(asset.id)) {
            this.assetRepo.remove(asset.id);
          }

          spinnerDialog?.close();
          resolve();
        })
        .catch((e) => {
          this.error("Archive asset error: " + e.message);
          spinnerDialog?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when setting the asset's archived flag. Check the console. ${e.message}`,
            title: "Archive Asset Error"
          };
          MakeAlertDialogUC.make(dialogDTO, this.appObjects);
          resolve();
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteAssetUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
