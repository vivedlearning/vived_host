import { AppObjectRepo } from "@vived/core";
import {
  AssetEntity,
  makeAppAssets,
  makeAssetEntity,
  makeAssetRepo
} from "../Entities";
import {
  makeAppAssetListPM,
  makeAssetFilePM,
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
  makeNewAssetUC,
  makePrefetchAssets,
  makeUpdateAppAssetMetaUC,
  makeUpdateAssetFileUC
} from "../UCs";

export function setupAssetsForSandbox(appObjects: AppObjectRepo) {
  const assetRepoAO = appObjects.getOrCreate("Asset Repository");
  const appAssetsAO = appObjects.getOrCreate("App Assets");

  // Entities
  const assetRepo = makeAssetRepo(assetRepoAO);
  assetRepo.assetFactory = makeAssetFactory(appObjects);
  makeAppAssets(appAssetsAO);

  // UCs
  makeEditAppAsset(assetRepoAO);
  makeGetAssetBlobURLUC(assetRepoAO);
  makeGetAssetFileUC(assetRepoAO);
  makeGetAssetUC(assetRepoAO);
  makePrefetchAssets(assetRepoAO);
  makeNewAssetUC(assetRepoAO);
  makeNewAppAssetUC(appAssetsAO);
  makeGetAppAssetUC(appAssetsAO);

  // PMs
  makeAppAssetListPM(appAssetsAO);
  makeShowArchivedAppAssetPM(appAssetsAO);
  makeEditingAppAssetPM(appAssetsAO);
}

function makeAssetFactory(appObjects: AppObjectRepo) {
  return function assetFactory(id: string): AssetEntity {
    const ao = appObjects.getOrCreate(id);

    // Entities
    const entity = makeAssetEntity(ao);

    // UCs
    makeArchiveAssetUC(ao);
    makeDeleteAssetUC(ao);
    makeDownloadAssetFileUC(ao);
    makeUpdateAssetFileUC(ao);
    makeUpdateAppAssetMetaUC(ao);

    // PMs
    makeAssetPM(ao);
    makeAssetFilePM(ao); // Add our new PM to each asset
    return entity;
  };
}
