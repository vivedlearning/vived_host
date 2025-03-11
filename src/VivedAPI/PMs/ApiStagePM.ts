import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { APIStage, VivedAPIEntity } from "../Entities";

export abstract class ApiStagePM extends AppObjectPM<APIStage> {
  static type = "ApiStagePM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ApiStagePM>(ApiStagePM.type, appObjects);
  }
}

export function makeApiStagePM(appObject: AppObject): ApiStagePM {
  return new ApiStagePMImp(appObject);
}

class ApiStagePMImp extends ApiStagePM {
  private get api() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  vmsAreEqual(a: APIStage, b: APIStage): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.api) return;

    this.doUpdateView(this.api.apiStage);
  };

  constructor(appObject: AppObject) {
    super(appObject, ApiStagePM.type);
    this.appObjects.registerSingleton(this);

    this.api?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
