import { getSingletonComponent, AppObjectPM, AppObjectRepo } from "@vived/core";

export interface FatalErrorVM {
  show: boolean;
  message: string;
  sender: string;
  playerVersion: string;
  apps: { id: string; name: string; version: string }[];
}

export const defaultFatalErrorVM: FatalErrorVM = {
  show: false,
  apps: [],
  message: "",
  playerVersion: "",
  sender: ""
};

export abstract class FatalErrorPM extends AppObjectPM<FatalErrorVM> {
  static type = "FatalErrorPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<FatalErrorPM>(FatalErrorPM.type, appObjects);
  }
}
