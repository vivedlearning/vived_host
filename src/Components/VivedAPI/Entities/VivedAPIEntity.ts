import { MemoizedString } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";

export enum APIStage {
  PRODUCTION = "Production",
  STAGING = "Staging",
  DEVELOPMENT = "Development",
  LOCAL = "LOCAL"
}

export class VivedAPIEntity extends AppObjectEntity {
  static type = "VivedAPIEntity";

  static get(appObjects: AppObjectRepo): VivedAPIEntity | undefined {
    return getSingletonComponent(VivedAPIEntity.type, appObjects);
  }

  productionURL = "https://api.vivedlearning.com";
  stagingURL = "https://api-staging.vivedlearning.com";
  developmentURL = "https://api-test.vivedlearning.com";
  localURL = "http://localhost:3001";

  private memoizedApiState = new MemoizedString(
    APIStage.PRODUCTION,
    this.notifyOnChange
  );

  get apiStage() {
    return this.memoizedApiState.val as APIStage;
  }
  set apiStage(apiState: APIStage) {
    this.memoizedApiState.val = apiState;
  }

  get baseUrl(): string {
    if (this.memoizedApiState.val === APIStage.PRODUCTION) {
      return "https://api.vivedlearning.com";
    }
    if (this.memoizedApiState.val === APIStage.STAGING) {
      return "https://api-staging.vivedlearning.com";
    }
    if (this.memoizedApiState.val === APIStage.DEVELOPMENT) {
      return "https://api-test.vivedlearning.com";
    }
    return "http://localhost:3001";
  }

  getEndpointURL = (endpoint: string): URL => {
    return new URL(endpoint, this.baseUrl);
  };

  private memoizedUserToken = new MemoizedString("", this.notifyOnChange);
  get userToken(): string {
    return this.memoizedUserToken.val;
  }
  set userToken(val: string) {
    this.memoizedUserToken.val = val;
  }

  constructor(appObject: AppObject) {
    super(appObject, VivedAPIEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
