import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { DispatchShowBabylonInspectorUC } from "../../Dispatcher";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";


export abstract class ShowBabylonInspectorUC extends HostAppObjectUC {
  static type = "ShowBabylonInspectorUC";

  abstract toggleShow(): void;
  abstract hide(): void;

  static get(appObject: HostAppObject): ShowBabylonInspectorUC | undefined {
    const asset = appObject.getComponent<ShowBabylonInspectorUC>(
      ShowBabylonInspectorUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "ShowBabylonInspectorUC.get",
        "Unable to find ShowBabylonInspectorUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): ShowBabylonInspectorUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "ShowBabylonInspectorUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return ShowBabylonInspectorUC.get(appObject);
  }
}

export function makeShowBabylonInspectorUC(
  appObject: HostAppObject
): ShowBabylonInspectorUC {
  return new ShowBabylonInspectorUCImp(appObject);
}

class ShowBabylonInspectorUCImp extends ShowBabylonInspectorUC {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get dispatchShowBabylon() {
    return this.getCachedLocalComponent<DispatchShowBabylonInspectorUC>(
      DispatchShowBabylonInspectorUC.type
    );
  }

  toggleShow = () => {
    if (!this.sandbox || !this.dispatchShowBabylon) return;

    this.sandbox.showBabylonInspector = !this.sandbox.showBabylonInspector;
    this.dispatchShowBabylon.doDispatch(this.sandbox.showBabylonInspector);
  };

  hide = () => {
    if (!this.sandbox || !this.dispatchShowBabylon) return;

    this.sandbox.showBabylonInspector = false;
    this.dispatchShowBabylon.doDispatch(false);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, ShowBabylonInspectorUC.type);
  }
}
