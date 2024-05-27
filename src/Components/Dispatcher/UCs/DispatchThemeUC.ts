import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchThemeUC extends HostAppObjectUC {
  static readonly type = "DispatchThemeUC";
  readonly requestType = "SET_THEME_COLORS";

  abstract doDispatch(colors: object): void;

  static get(appObject: HostAppObject): DispatchThemeUC | undefined {
    const asset = appObject.getComponent<DispatchThemeUC>(DispatchThemeUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchThemeUC.get",
        "Unable to find DispatchThemeUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(id: string, appObjects: HostAppObjectRepo): DispatchThemeUC | undefined {
    const appObject =  appObjects.get(id);
    
    if(!appObject) {
      appObjects.submitWarning(
        "DispatchThemeUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchThemeUC.get(appObject);
  }
}

export function makeDispatchThemeUC(appObject: HostAppObject): DispatchThemeUC {
  return new DispatchThemeUCImp(appObject);
}

class DispatchThemeUCImp extends DispatchThemeUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(colors: object): void {
    if (!this.dispatcher) return;

    const payload = {
      colors
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchThemeUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
    if (!this.dispatcher) {
      this.error(
        "UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first"
      );
      this.dispose();
    }
  }
}
