import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { VivedAPIEntity } from "../Entities";

export abstract class UserTokenPM extends AppObjectPM<string> {
  static type = "UserTokenPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<UserTokenPM>(UserTokenPM.type, appObjects);
  }
}

export function makeUserTokenPM(appObject: AppObject): UserTokenPM {
  return new UserTokenPMImp(appObject);
}

class UserTokenPMImp extends UserTokenPM {
  private get sandbox() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  vmsAreEqual(a: string, b: string): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.userToken);
  };

  constructor(appObject: AppObject) {
    super(appObject, UserTokenPM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
