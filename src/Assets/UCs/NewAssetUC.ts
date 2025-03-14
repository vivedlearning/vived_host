import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { NewAssetApiDto, PostNewAssetUC } from "../../VivedAPI/UCs";
import { AssetRepo } from "../Entities";

export interface NewAssetDto {
  file: File;
  name: string;
  description: string;
  owner: string;
}

export abstract class NewAssetUC extends AppObjectUC {
  static type = "NewAssetUC";

  abstract create(data: NewAssetDto): Promise<string>;

  static get(appObjects: AppObjectRepo): NewAssetUC | undefined {
    return getSingletonComponent(NewAssetUC.type, appObjects);
  }
}

export function makeNewAssetUC(appObject: AppObject): NewAssetUC {
  return new NewAssetUCImp(appObject);
}

class NewAssetUCImp extends NewAssetUC {
  private get postNewAsset() {
    return this.getCachedSingleton<PostNewAssetUC>(PostNewAssetUC.type)?.doPost;
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  create = (data: NewAssetDto): Promise<string> => {
    const postNewAsset = this.postNewAsset;
    const assetRepo = this.assetRepo;

    if (!postNewAsset || !assetRepo) {
      return Promise.reject(new Error("Missing dependencies"));
    }

    const { description, file, name, owner } = data;
    const newAssetData: NewAssetApiDto = {
      description,
      name,
      file,
      ownerID: owner
    };

    return postNewAsset(newAssetData).then((resp) => {
      const newAsset = assetRepo.assetFactory(resp.id);
      newAsset.setFile(file);
      newAsset.description = description;
      newAsset.name = name;
      newAsset.filename = resp.filename;

      assetRepo.add(newAsset);
      return resp.id;
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, NewAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
