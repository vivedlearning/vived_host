import { AppObject, AppObjectRepo } from "@vived/core";
import { makeMounterUC } from "../../Apps";
import {
  makeDispatchDisposeAppUC,
  makeDispatchStartBrowseChannelsUC,
  makeDispatchStopAppUC,
  makeHostDispatchEntity
} from "../../Dispatcher";
import {
  makeCloseAssetSystemPluginUC,
  makeGetAssetFolderURLHandler,
  makeHostHandlerEntity,
  makeRegisterExternalStyleSheetsHandler
} from "../../Handler";
import { AssetPluginEntity, makeAssetPluginEntity } from "../Entities";
import { makeAssetPluginPM } from "../PM";
import { makeSandboxAssetPluginContainerUC } from "../UCs";

export function setupAssetsPluginForSandbox(
  id: string,
  appObjects: AppObjectRepo
): AssetPluginEntity {
  const ao = appObjects.getOrCreate(id);

  // Entities
  const entity = makeAssetPluginEntity(ao);
  makeHostHandlerEntity(ao);
  makeHostDispatchEntity(ao);

  // UCs
  makeMounterUC(ao);
  makeSandboxAssetPluginContainerUC(ao);

  setupDispatchers(ao);
  setupHandlers(ao);

  // PMs
  makeAssetPluginPM(ao);

  return entity;
}

function setupDispatchers(ao: AppObject) {
  makeDispatchStartBrowseChannelsUC(ao);
  makeDispatchStopAppUC(ao);
  makeDispatchDisposeAppUC(ao);
}

function setupHandlers(ao: AppObject) {
  makeGetAssetFolderURLHandler(ao);
  makeRegisterExternalStyleSheetsHandler(ao);
  makeCloseAssetSystemPluginUC(ao);
}
