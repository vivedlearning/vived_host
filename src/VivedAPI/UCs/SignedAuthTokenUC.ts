import { AppObjectRepo, AppObjectUC, getSingletonComponent } from "@vived/core";

export abstract class SignedAuthTokenUC extends AppObjectUC {
  static type = "SignedAuthTokenUC";

  abstract getAuthToken(): Promise<string>;

  static get(appObjects: AppObjectRepo): SignedAuthTokenUC | undefined {
    return getSingletonComponent(SignedAuthTokenUC.type, appObjects);
  }
}
