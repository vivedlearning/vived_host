import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";


export abstract class UpdateAppUC extends HostAppObjectUC {
  static type = "UpdateAppUC";

  abstract updateApp(confirm?: boolean): Promise<void>;

  static get(appObject: HostAppObject): UpdateAppUC | undefined {
    const asset = appObject.getComponent<UpdateAppUC>(UpdateAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "UpdateAppUC.get",
        "Unable to find UpdateAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): UpdateAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "UpdateAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return UpdateAppUC.get(appObject);
  }
}
