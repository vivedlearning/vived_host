import {
  getSingletonComponent,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";

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

export abstract class FatalErrorPM extends HostAppObjectPM<FatalErrorVM> {
  static type = "FatalErrorPM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<FatalErrorPM>(FatalErrorPM.type, appObjects);
  }
}
