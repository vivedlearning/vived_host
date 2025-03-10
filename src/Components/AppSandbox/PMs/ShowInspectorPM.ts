import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export abstract class ShowInspectorPM extends AppObjectPM<boolean> {
  static type = "ShowInspectorPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ShowInspectorPM>(
      ShowInspectorPM.type,
      appObjects
    );
  }
}

export function makeShowInspectorPM(appObject: AppObject): ShowInspectorPM {
  return new ShowInspectorPMImp(appObject);
}

class ShowInspectorPMImp extends ShowInspectorPM {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.showBabylonInspector);
  };

  constructor(appObject: AppObject) {
    super(appObject, ShowInspectorPM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
