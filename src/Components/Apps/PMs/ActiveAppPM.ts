import { AppObjectPM, AppObjectRepo } from "@vived/core";

export interface ActiveAppVM {
  id: string;
  stylesheets: string[];
}

export const defaultActiveAppVM: ActiveAppVM = {
  id: "",
  stylesheets: []
};

export abstract class ActiveAppPM extends AppObjectPM<ActiveAppVM> {
  static type = "ActiveAppPM";

  static get(appObjects: AppObjectRepo) {
    return appObjects.getSingleton<ActiveAppPM>(ActiveAppPM.type);
  }
}
