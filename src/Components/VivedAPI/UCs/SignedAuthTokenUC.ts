import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class SignedAuthTokenUC extends AppObjectUC {
  static type = "SignedAuthTokenUC";

  abstract getPlayerAuthToken(): Promise<string>;
  abstract getUserAuthToken(): Promise<string>;

  static get(appObjects: AppObjectRepo): SignedAuthTokenUC | undefined {
    return getSingletonComponent(SignedAuthTokenUC.type, appObjects);
  }
}
