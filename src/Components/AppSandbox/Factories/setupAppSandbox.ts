import { HostAppObjectRepo } from "../../../HostAppObject";
import { makeSandboxMounter, makeStartAppUC, makeStopAppUC } from "../../Apps";
import {
  makeHostDispatchEntity,
  setupStandardHostDispatchers
} from "../../Dispatcher";
import {
  makeHostHandlerEntity,
  setupStandardHostHandlers
} from "../../Handler";
import { AppSandboxEntity, makeAppSandboxEntity } from "../Entities";
import {
  makeDevFeaturesEnabledPM,
  makeSandboxStatePM,
  makeShowInspectorPM,
  makeStartInZSpacePM
} from "../PMs";
import { makeShowBabylonInspectorUC } from "../UCs";

export function setupAppSandbox(
  appID: string,
  appObjects: HostAppObjectRepo
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

  return entity;
}
