import { HostAppObjectRepo } from "../../../HostAppObject";
import {
  AssetEntity,
  makeAppAssets,
  makeAssetEntity,
  makeAssetRepo
} from "../Entities";
import {
  makeAppAssetListPM,
  makeAssetPM,
  makeEditingAppAssetPM,
  makeShowArchivedAppAssetPM
} from "../PMs";
import {
  makeArchiveAssetUC,
  makeDeleteAssetUC,
  makeDownloadAssetFileUC,
  makeEditAppAsset,
  makeGetAppAssetUC,
  makeGetAssetBlobURLUC,
  makeGetAssetFileUC,
  makeGetAssetUC,
  makeNewAppAssetUC,
  makePrefetchAssets,
  makeUpdateAppAssetMetaUC,
  makeUpdateAssetFileUC
} from "../UCs";

export function setupAssetsForSandbox(appObjects: HostAppObjectRepo) {
  const assetRepoAO = appObjects.getOrCreate("Asset Repository");
  const appAssetsAO = appObjects.getOrCreate("App Assets");

  //Entities
  const assetRepo = makeAssetRepo(assetRepoAO);
  assetRepo.assetFactory = makeAssetFactory(appObjects);
  makeAppAssets(appAssetsAO);

  //UCs
  makeEditAppAsset(assetRepoAO);
  makeGetAssetBlobURLUC(assetRepoAO);
  makeGetAssetFileUC(assetRepoAO);
  makeGetAssetUC(assetRepoAO);
  makePrefetchAssets(assetRepoAO);

  makeNewAppAssetUC(appAssetsAO);
  makeGetAppAssetUC(appAssetsAO);

  //PMs
  makeAppAssetListPM(appAssetsAO);
  makeShowArchivedAppAssetPM(appAssetsAO);
  makeEditingAppAssetPM(appAssetsAO);
}

function makeAssetFactory(appObjects: HostAppObjectRepo) {
  return function (id: string): AssetEntity {
    const ao = appObjects.getOrCreate(id);

    //Entities
    const entity = makeAssetEntity(ao);

    //UCs
    makeArchiveAssetUC(ao);
    makeDeleteAssetUC(ao);
    makeDownloadAssetFileUC(ao);
    makeUpdateAssetFileUC(ao);
    makeUpdateAppAssetMetaUC(ao);

    //PMs
    makeAssetPM(ao);
    return entity;
  };
}
