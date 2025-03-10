import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  AppSandboxEntity,
  SandboxState
} from "../../AppSandbox/Entities/AppSandboxEntity";
import { DialogAlertDTO } from "../../Dialog/Entities";
import { MakeAlertDialogUC, MakeSpinnerDialogUC } from "../../Dialog/UCs";
import { PatchAssetMetaUC } from "../../VivedAPI/UCs/PatchAssetMetaUC";
import { AssetEntity } from "../Entities";

export interface UpdateAppAssetMetaDTO {
  name: string;
  description: string;
  archived: boolean;
}

export abstract class UpdateAppAssetMetaUC extends AppObjectUC {
  static type = "UpdateAppAssetMetaUC";

  abstract updateMeta(data: UpdateAppAssetMetaDTO): Promise<void>;

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): UpdateAppAssetMetaUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "UpdateAppAssetMetaUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<UpdateAppAssetMetaUC>(
      UpdateAppAssetMetaUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "UpdateAppAssetMetaUC.get",
        "App Object does not have UpdateAssetMetaUC"
      );
      return undefined;
    }

    return uc;
  }
}

export function makeUpdateAppAssetMetaUC(
  appObject: AppObject
): UpdateAppAssetMetaUC {
  return new UpdateAppAssetMetaUCImp(appObject);
}

class UpdateAppAssetMetaUCImp extends UpdateAppAssetMetaUC {
  private get asset() {
    return this.getCachedLocalComponent<AssetEntity>(AssetEntity.type);
  }

  private get spinnerFactory() {
    return this.getCachedSingleton<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type
    );
  }

  private get patchAssetMeta() {
    return this.getCachedSingleton<PatchAssetMetaUC>(PatchAssetMetaUC.type)
      ?.doPatch;
  }

  private get alertFactory() {
    return this.getCachedSingleton<MakeAlertDialogUC>(MakeAlertDialogUC.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  updateMeta = (data: UpdateAppAssetMetaDTO): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const patchAssetMeta = this.patchAssetMeta;
    if (!patchAssetMeta) {
      return Promise.reject(new Error("No Patch UC"));
    }

    const { archived, description, name } = data;

    const spinnerDialog = this.spinnerFactory?.make({
      title: "Asset Meta",
      message: "Updating asset's meta..."
    });

    return new Promise((resolve, reject) => {
      patchAssetMeta({
        archived,
        description,
        id: asset.id,
        name
      })
        .then(() => {
          asset.archived = archived;
          asset.name = name;
          asset.description = description;

          spinnerDialog?.close();
          if (this.sandbox) this.sandbox.state = SandboxState.MOUNTED;
          resolve();
        })
        .catch((e) => {
          this.error("Patch asset error: " + e.message);
          spinnerDialog?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when updating the assets meta. Check the console. ${e.message}`,
            title: "Update Asset Error"
          };
          this.alertFactory?.make(dialogDTO);
          resolve();
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, UpdateAppAssetMetaUC.type);
  }
}
