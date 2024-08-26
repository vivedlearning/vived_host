import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { VIVEDApp_3 } from "../../../Types";
import { Version } from "../../../ValueObjects";

export abstract class MounterUC extends HostAppObjectUC {
  static type = "MounterUC";

  abstract mount(majorVersion: number, minorVersion: number): Promise<void>;
  abstract unmount(): void;
  abstract loadScriptIntoDocument(
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void>; //Exposed for testing purposes
  abstract getAppInterface(version: Version): VIVEDApp_3 | undefined; //Exposed for test purposes

  static get(appObject: HostAppObject) {
    return appObject.getComponent<MounterUC>(MounterUC.type);
  }

  static getById(id: string, appObjects: HostAppObjectRepo) {
    const ao = appObjects.get(id);
    return ao?.getComponent<MounterUC>(MounterUC.type);
  }
}
