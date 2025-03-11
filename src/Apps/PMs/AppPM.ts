import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AppEntity } from "../Entities/AppEntity";

export interface AppVM {
  id: string;
  name: string;
  description: string;
  imageURL: string;
}

export const defaultAppVM: AppVM = {
  id: "",
  description: "",
  imageURL: "",
  name: ""
};

export abstract class AppPM extends AppObjectPM<AppVM> {
  static type = "AppPM";

  static get(id: string, appObjects: AppObjectRepo) {
    const ao = appObjects.get(id);
    if (!ao) {
      return;
    }

    return ao.getComponent<AppPM>(AppPM.type);
  }
}

export function makeAppPM(appObject: AppObject): AppPM {
  return new AppPMImp(appObject);
}

class AppPMImp extends AppPM {
  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  vmsAreEqual(a: AppVM, b: AppVM): boolean {
    if (a.description !== b.description) return false;
    if (a.name !== b.name) return false;
    if (a.imageURL !== b.imageURL) return false;
    return true;
  }

  private onEntityChange = () => {
    if (!this.app) return;

    const vm: AppVM = {
      description: this.app.description,
      id: this.app.id,
      imageURL: this.app.image_url,
      name: this.app.name
    };

    this.doUpdateView(vm);
  };

  constructor(appObject: AppObject) {
    super(appObject, AppPM.type);

    this.app?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
