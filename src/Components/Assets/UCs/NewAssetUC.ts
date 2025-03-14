import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { NewAssetApiDto, PostNewAssetUC } from "../../VivedAPI/UCs";
import { AssetRepo } from "../Entities";

export interface NewAssetDto {
  file: File;
  name: string;
  description: string;
  owner: string;
}

export abstract class NewAssetUC extends HostAppObjectUC {
  static type = "NewAssetUC";

  abstract create(data: NewAssetDto): Promise<string>;

  static get(appObjects: HostAppObjectRepo): NewAssetUC | undefined {
    return getSingletonComponent(NewAssetUC.type, appObjects);
  }
}

export function makeNewAssetUC(appObject: HostAppObject): NewAssetUC {
  return new NewAssetUCImp(appObject);
}

class NewAssetUCImp extends NewAssetUC {
  private get postNewAsset() {
    return this.getCachedSingleton<PostNewAssetUC>(PostNewAssetUC.type)?.doPost;
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  private get spinnerFactory() {
    return this.getCachedSingleton<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type
    );
  }

  private get alertFactory() {
    return this.getCachedSingleton<MakeAlertDialogUC>(MakeAlertDialogUC.type);
  }

  create = (data: NewAssetDto): Promise<string> => {
    const postNewAsset = this.postNewAsset;
    const assetRepo = this.assetRepo;

    if (!postNewAsset || !assetRepo) {
      return Promise.reject();
    }

    return new Promise<string>((resolve) => {
      const { description, file, name, owner } = data;

      const newAssetData: NewAssetApiDto = {
        description,
        name,
        file,
        ownerID: owner
      };

      const spinnerDialog = this.spinnerFactory?.make({
        title: "New Asset",
        message: "Posting new asset..."
      });

      postNewAsset(newAssetData)
        .then((resp) => {
          const newAsset = assetRepo.assetFactory(resp.id);
          newAsset.setFile(file);
          newAsset.description = description;
          newAsset.name = name;
          newAsset.filename = resp.filename;

          assetRepo.add(newAsset);

          spinnerDialog?.close();
          resolve(resp.id);
        })
        .catch((e: Error) => {
          this.error("create new asset error: " + e.message);
          spinnerDialog?.close();

          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when creating a new app asset. Check the console. ${e.message}`,
            title: "New Asset Error"
          };
          this.alertFactory?.make(dialogDTO);

          resolve("");
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, NewAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
