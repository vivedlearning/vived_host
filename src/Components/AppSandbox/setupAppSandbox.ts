import {
  HostAppObject,
  HostAppObjectRepo,
  makeDispatchDisposeAppUC,
  makeDispatchIsAuthoringUC,
  makeDispatchSetStateUC,
  makeDispatchShowBabylonInspectorUC,
  makeDispatchStartAppUC,
  makeDispatchStopAppUC,
  makeDispatchThemeUC,
  makeHostDispatchEntity,
  makeHostHandlerEntity,
  makeDispatchStartZSpaceUC,
  makeDispatchStopZSpaceUC,
  makeGetAssetBlobURLHandler,
  makeGetAssetFolderURLHandler,
  makeGetAssetMetaHandler,
  makeGetLinkedAssetsHandler,
  makeGoToNextStateHandler,
  makeGoToPreviousStateHandler,
  makeHasNextStateHandler,
  makeHasPreviousStateHandler,
  makeIsZSpaceAvailableHandler,
  makeOnAppIsReadyHandler,
  makeOnStateChangeHandler,
  makeOnStateCompleteHandler,
  makeRegisterExternalStyleSheetsHandler,
  makeShowAlertHandler,
  makeShowConfirmHandler,
  makeShowMarkDownEditorHandler,
  makeShowSelectModelHandler,
  makeShowSpinnerHandler,
  makeStartZSpaceHandler,
  makeStopZSpaceHandler,
  makeSubmitLogHandler,
  makeSubmitResultHandler,
  Version,
  makeStartAppUC,
  makeStopAppUC
} from "@vived/host";
import { SandboxMounterUC } from "./UCs/SandboxMounterUC";
import { makeIsZSpaceAvailableAction } from "./UCs/HandlerActions/isZSpaceAvailableAction";
import { makeOnAppIsReadyHandlerAction } from "./UCs/HandlerActions/onAppIsReadyHandlerAction";
import { makeShowBabylonInspectorUC } from "./UCs/ShowBabylonInspectorUC";
import {
  AppSandboxEntity,
  makeAppSandboxEntity
} from "./Entities/AppSandboxEntity";
import { makeDevFeaturesEnabledPM } from "./PMs/DevFeaturesEnabledPM";
import { makeSandboxStatePM } from "./PMs/SandboxStatePM";
import { makeShowInspectorPM } from "./PMs/ShowInspectorPM";
import { makeStartInZSpacePM } from "./PMs/StartInZSpacePM";
import packageJson from "../../../../package.json";

export function setupAppSandbox(
  appID: string,
  appObjects: HostAppObjectRepo
): AppSandboxEntity {
  const ao = appObjects.getOrCreate(appID);

  //Entities
  const entity = makeAppSandboxEntity(ao);
  makeHostDispatchEntity(ao);
  makeHostHandlerEntity(ao);

  //UC
  setupDispatchers(ao);
  setupHandlers(ao);
  makeStartAppUC(ao);
  makeStopAppUC(ao);
  makeShowBabylonInspectorUC(ao);
  new SandboxMounterUC(ao);

  //PMs
  makeDevFeaturesEnabledPM(ao);
  makeSandboxStatePM(ao);
  makeShowInspectorPM(ao);
  makeStartInZSpacePM(ao);

  entity.app.appAssetFolderURL =
    window.location.href.replace(`index.html${window.location.search}`, "") +
    "assets";

  entity.app.versions = [Version.FromString(packageJson.version)];

  return entity;
}

function setupDispatchers(appAO: HostAppObject) {
  makeDispatchDisposeAppUC(appAO);
  makeDispatchIsAuthoringUC(appAO);
  makeDispatchSetStateUC(appAO);
  makeDispatchShowBabylonInspectorUC(appAO);
  makeDispatchStartAppUC(appAO);
  makeDispatchStartZSpaceUC(appAO);
  makeDispatchStopAppUC(appAO);
  makeDispatchStopZSpaceUC(appAO);
  makeDispatchThemeUC(appAO);
}

function setupHandlers(appAO: HostAppObject) {
  makeGetAssetBlobURLHandler(appAO);
  makeGetAssetFolderURLHandler(appAO);
  makeGetAssetMetaHandler(appAO);
  makeGetLinkedAssetsHandler(appAO);
  makeGoToNextStateHandler(appAO);
  makeGoToPreviousStateHandler(appAO);
  makeHasNextStateHandler(appAO);
  makeHasPreviousStateHandler(appAO);
  makeIsZSpaceAvailableHandler(appAO).action = makeIsZSpaceAvailableAction();
  makeOnAppIsReadyHandler(appAO).action = makeOnAppIsReadyHandlerAction(
    appAO.appObjectRepo
  );
  makeOnStateChangeHandler(appAO);
  makeOnStateCompleteHandler(appAO);
  makeRegisterExternalStyleSheetsHandler(appAO);
  makeShowAlertHandler(appAO);
  makeShowConfirmHandler(appAO);
  makeShowMarkDownEditorHandler(appAO);
  makeShowSelectModelHandler(appAO);
  makeShowSpinnerHandler(appAO);
  makeStartZSpaceHandler(appAO);
  makeStopZSpaceHandler(appAO);
  makeSubmitLogHandler(appAO);
  makeSubmitResultHandler(appAO);
}
