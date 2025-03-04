import { HostAppObject } from "../../HostAppObject";
import {
  makeDispatchDisposeAppUC,
  makeDispatchEnableFeatureUC,
  makeDispatchIsAuthoringUC,
  makeDispatchSetStateUC,
  makeDispatchShowBabylonInspectorUC,
  makeDispatchStartAppUC,
  makeDispatchStartZSpaceUC,
  makeDispatchStopAppUC,
  makeDispatchStopZSpaceUC,
  makeDispatchThemeUC
} from "./UCs";

export function setupStandardHostDispatchers(appObject: HostAppObject) {
  makeDispatchDisposeAppUC(appObject);
  makeDispatchEnableFeatureUC(appObject);
  makeDispatchIsAuthoringUC(appObject);
  makeDispatchSetStateUC(appObject);
  makeDispatchShowBabylonInspectorUC(appObject);
  makeDispatchStartAppUC(appObject);
  makeDispatchStartZSpaceUC(appObject);
  makeDispatchStopAppUC(appObject);
  makeDispatchStopZSpaceUC(appObject);
  makeDispatchThemeUC(appObject);
}
