import { AppObjectRepo } from "@vived/core";
import {
  makeSandboxMounter,
  makeStartAppUC,
  makeStopAppUC
} from "../../Apps/UCs";
import { makeHostDispatchEntity } from "../../Dispatcher/Entities";
import { setupStandardHostDispatchers } from "../../Dispatcher/setupStandardHostDispatchers";
import { makeHostHandlerEntity } from "../../Handler/Entities";
import { setupStandardHostHandlers } from "../../Handler/setupStandardHostHandlers";
import { AppSandboxEntity, makeAppSandboxEntity } from "../Entities";
import {
  makeDevFeaturesEnabledPM,
  makeSandboxStatePM,
  makeShowInspectorPM,
  makeStartInZSpacePM
} from "../PMs";
import { makeShowBabylonInspectorUC } from "../UCs";
import { SubmitActivityAssetHandler } from "../../Handler";
import { makeSubmitActivityAssetHandlerSandbox } from "../UCs/submitActivityAssetHandlerSandbox";

export function setupAppSandbox(
  appID: string,
  appObjects: AppObjectRepo
): AppSandboxEntity {
  const ao = appObjects.getOrCreate(appID);

  // Entities
  const entity = makeAppSandboxEntity(ao);
  makeHostDispatchEntity(ao);
  makeHostHandlerEntity(ao);

  // UC
  setupStandardHostDispatchers(ao);
  setupStandardHostHandlers(ao);
  makeStartAppUC(ao);
  makeStopAppUC(ao);
  makeShowBabylonInspectorUC(ao);
  makeSandboxMounter(ao);

  // PMs
  makeDevFeaturesEnabledPM(ao);
  makeSandboxStatePM(ao);
  makeShowInspectorPM(ao);
  makeStartInZSpacePM(ao);

  const submitActivityAssetUC = appObjects.getSingleton<SubmitActivityAssetHandler>(
    SubmitActivityAssetHandler.type
  );
  if (submitActivityAssetUC) {
    submitActivityAssetUC.action = makeSubmitActivityAssetHandlerSandbox(
      appObjects
    );
  }

  return entity;
}
