import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import {
  DialogAlertDTO,
  DialogQueue,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { AssetEntity } from "../Entities/AssetEntity";
import { GetAssetFileUC } from "./GetAssetFileUC";

export abstract class DownloadAssetFileUC extends HostAppObjectUC {
  static type = "DownloadAssetFileUC";

  abstract download(): Promise<void>;
  abstract saveFileLocally(): void;

  static get(
    assetID: string,
    appObjects: HostAppObjectRepo
  ): DownloadAssetFileUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "DownloadAssetFileUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<DownloadAssetFileUC>(
      DownloadAssetFileUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "DownloadAssetFileUC.get",
        "App Object does not have DownloadAssetFileUC"
      );
      return undefined;
    }

    return uc;
  }
}

export function makeDownloadAssetFileUC(
  appObject: HostAppObject
): DownloadAssetFileUC {
  return new DownloadAssetFileUCImp(appObject);
}

class DownloadAssetFileUCImp extends DownloadAssetFileUC {
  private asset?: AssetEntity;

  private get getAssetFile() {
    return this.getCachedSingleton<GetAssetFileUC>(GetAssetFileUC.type)
      ?.getAssetFile;
  }

  download = (): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    if (asset.blobURL) {
      this.saveFileLocally();
      return Promise.resolve();
    }

    const getAssetFile = this.getAssetFile;
    if (!getAssetFile) {
      return Promise.reject();
    }

    const title = "Download Asset";
    const spinnerDialog = MakeSpinnerDialogUC.make(
      {
        title,
        message: "Downloading asset..."
      },
      this.appObjects
    );

    return new Promise((resolve) => {
      getAssetFile(asset.id)
        .then(() => {
          spinnerDialog?.close();
          this.saveFileLocally();
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

  saveFileLocally = () => {
    if (!this.asset) {
      this.error("No Asset");
      return;
    }

    if (!this.asset.blobURL) {
      this.error("No blob URL");
      return;
    }

    const a = document.createElement("a");
    a.href = this.asset.blobURL;
    a.download = this.asset.filename;
    a.click();
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DownloadAssetFileUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
