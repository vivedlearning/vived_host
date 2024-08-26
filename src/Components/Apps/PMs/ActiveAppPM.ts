import { HostAppObjectPM, HostAppObjectRepo } from "../../../HostAppObject";

export interface ActiveAppVM {
  id: string;
  stylesheets: string[];
}

export const defaultActiveAppVM: ActiveAppVM = {
  id: "",
  stylesheets: []
};

export abstract class ActiveAppPM extends HostAppObjectPM<ActiveAppVM> {
  static type = "ActiveAppPM";

  static get(appObjects: HostAppObjectRepo) {
    return appObjects.getSingleton<ActiveAppPM>(ActiveAppPM.type);
  }
}
