import { AppObjectRepo } from "@vived/core";
import { VivedAPIEntity } from "../Entities";
import { makeUserTokenPM } from "../PMs";
import {
  makeDeleteAssetOnAPIUC,
  makeFetchAssetFileFromAPIUC,
  makeFetchAssetMetaFromAPIUC,
  makeFileUploadUC,
  makeGetAppFromAPIUC,
  makeGetAssetsForOwnerFromAPIUC,
  makePatchAssetFileUC,
  makePatchAssetIsArchivedUC,
  makePatchAssetMetaUC,
  makePatchAssetUC,
  makePostNewAssetUC
} from "../UCs";

export function setupVivedAPIForSandbox(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("VIVED API");

  // Entities
  new VivedAPIEntity(ao);

  // UCs
  makeDeleteAssetOnAPIUC(ao);
  makeFetchAssetFileFromAPIUC(ao);
  makeFetchAssetMetaFromAPIUC(ao);
  makeFileUploadUC(ao);
  makeGetAppFromAPIUC(ao);
  makeGetAssetsForOwnerFromAPIUC(ao);
  makePatchAssetFileUC(ao);
  makePatchAssetIsArchivedUC(ao);
  makePatchAssetMetaUC(ao);
  makePatchAssetUC(ao);
  makePostNewAssetUC(ao);

  // PMs
  makeUserTokenPM(ao);
}
