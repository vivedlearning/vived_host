import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../AppSandbox";
import { DialogAlertDTO, MakeAlertDialogUC, MakeSpinnerDialogUC } from "../../Dialog";
import { NewAssetDTO, PostNewAssetUC } from "../../VivedAPI";
import { AppAssetsEntity, AssetRepo } from "../Entities";

export interface NewAppAssetDTO {
  file: File;
  name: string;
  description: string;
}

export abstract class NewAppAssetUC extends HostAppObjectUC {
  static type = "NewAppAssetUC";

  abstract create(data: NewAppAssetDTO): Promise<void>;

  static get(appObjects: HostAppObjectRepo): NewAppAssetUC | undefined {
    return getSingletonComponent(NewAppAssetUC.type, appObjects);
  }
}

export function makeNewAppAssetUC(appObject: HostAppObject): NewAppAssetUC {
  return new NewAppAssetUCImp(appObject);
}

class NewAppAssetUCImp extends NewAppAssetUC {
  private appAssets?: AppAssetsEntity;

  private get postNewAsset() {
    return this.getCachedSingleton<PostNewAssetUC>(PostNewAssetUC.type)?.doPost;
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get spinnerFactory() {
    return this.getCachedSingleton<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type
    );
  }

  private get alertFactory() {
    return this.getCachedSingleton<MakeAlertDialogUC>(MakeAlertDialogUC.type);
  }

  create = (data: NewAppAssetDTO): Promise<void> => {
    const appAssets = this.appAssets;
    const postNewAsset = this.postNewAsset;
    const sandbox = this.sandbox;
    const assetRepo = this.assetRepo;

    if (!appAssets || !postNewAsset || !sandbox || !assetRepo) {
      return Promise.reject();
    }

    return new Promise<void>((resolve) => {
      const { description, file, name } = data;

      const newAssetData: NewAssetDTO = {
        description,
        name,
        file,
        ownerID: sandbox.appID
      };

      const spinnerDialog = this.spinnerFactory?.make({
        title: "New App Asset",
        message: "Posting new app asset..."
      });

      postNewAsset(newAssetData)
        .then((resp) => {
          appAssets.add(resp.id);

          const newAsset = assetRepo.assetFactory(resp.id);
          newAsset.setFile(file);
          newAsset.description = description;
          newAsset.name = name;
          newAsset.filename = resp.filename;

          assetRepo.add(newAsset);
          this.sandbox!.state = SandboxState.MOUNTED;

          spinnerDialog?.close();
          resolve();
        })
        .catch((e: Error) => {
          this.error("create new asset error: " + e.message);
          spinnerDialog?.close();

          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when creating a new app asset. Check the console. ${e.message}`,
            title: "New App Asset Error",
            onClose: () => {}
          };
          this.alertFactory?.make(dialogDTO);

          resolve();
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, NewAppAssetUC.type);
    this.appObjects.registerSingleton(this);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(
      AppAssetsEntity.type
    );
    if (!this.appAssets) {
      this.error(
        "UC added to an App Object that does not have AppAssetsEntity"
      );
      return;
    }
  }
}
