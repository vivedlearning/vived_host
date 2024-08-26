import { HostAppObject, HostAppObjectPM, HostAppObjectRepo } from "../../../HostAppObject";
import { AppRepoEntity } from "../Entities";


export abstract class AppsListPM extends HostAppObjectPM<string[]> {
  static type = "AppsListPM";

  static get(appObjects: HostAppObjectRepo) {
    return appObjects.getSingleton<AppsListPM>(AppsListPM.type);
  }
}

export function makeAppListPM(appObject: HostAppObject): AppsListPM {
  return new AppListImp(appObject);
}

class AppListImp extends AppsListPM {
  private get slideApps() {
    return this.getCachedSingleton<AppRepoEntity>(AppRepoEntity.type);
  }

  vmsAreEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    let areEqual = true;

    a.forEach((aID, i) => {
      const bID = b[i];
      if (aID !== bID) areEqual = false;
    });
    return areEqual;
  }

  private onEntityChange = () => {
    if (!this.slideApps) return;

    const allApps = this.slideApps.getAllApps();
    const vms: string[] = [];

    allApps.forEach((app) => {
      if (app.assignedToOwner) {
        vms.push(app.id);
      }
    });

    this.doUpdateView(vms);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AppsListPM.type);

    this.slideApps?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}
