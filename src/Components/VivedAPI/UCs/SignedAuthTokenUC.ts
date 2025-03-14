import { getSingletonComponent, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";

export abstract class SignedAuthTokenUC extends HostAppObjectUC {
  static type = "SignedAuthTokenUC";

  abstract getAuthToken(): Promise<string>;

  static get(appObjects: HostAppObjectRepo): SignedAuthTokenUC | undefined {
    return getSingletonComponent(SignedAuthTokenUC.type, appObjects);
  }
}
