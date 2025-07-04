import { AppObject } from "@vived/core";
import {
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
  makeSubmitActivityAssetHandler,
  makeSubmitLogHandler,
  makeSubmitResultHandler
} from "./UCs";

export function setupStandardHostHandlers(appObject: AppObject) {
  makeGetAssetBlobURLHandler(appObject);
  makeGetAssetFolderURLHandler(appObject);
  makeGetAssetMetaHandler(appObject);
  makeGetLinkedAssetsHandler(appObject);
  makeGoToNextStateHandler(appObject);
  makeGoToPreviousStateHandler(appObject);
  makeHasNextStateHandler(appObject);
  makeHasPreviousStateHandler(appObject);
  makeIsZSpaceAvailableHandler(appObject);
  makeOnAppIsReadyHandler(appObject);
  makeOnStateChangeHandler(appObject);
  makeOnStateCompleteHandler(appObject);
  makeRegisterExternalStyleSheetsHandler(appObject);
  makeShowAlertHandler(appObject);
  makeShowConfirmHandler(appObject);
  makeShowMarkDownEditorHandler(appObject);
  makeShowSelectModelHandler(appObject);
  makeShowSpinnerHandler(appObject);
  makeStartZSpaceHandler(appObject);
  makeStopZSpaceHandler(appObject);
  makeSubmitActivityAssetHandler(appObject);
  makeSubmitLogHandler(appObject);
  makeSubmitResultHandler(appObject);
}
