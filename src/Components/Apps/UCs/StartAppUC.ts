import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";

export abstract class StartAppUC extends HostAppObjectUC {
  static type = "StartAppUC";

  abstract start(container: HTMLElement): void;

  static get(appObject: HostAppObject): StartAppUC | undefined {
    const asset = appObject.getComponent<StartAppUC>(StartAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "StartAppUC.get",
        "Unable to find StartAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): StartAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "StartAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return StartAppUC.get(appObject);
  }

  static startByID(
    container: HTMLElement,
    id: string,
    appObjects: HostAppObjectRepo
  ) {
    StartAppUC.getByID(id, appObjects)?.start(container);
  }
}
