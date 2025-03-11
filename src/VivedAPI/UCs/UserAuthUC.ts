import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class UserAuthUC extends AppObjectUC {
  static type = "UserAuthUC";

  abstract login(username: string, password: string): Promise<void>;
  abstract logout(): Promise<void>;
  abstract refreshAuthenticatedUser(): Promise<void>;

  static get(appObjects: AppObjectRepo): UserAuthUC | undefined {
    return getSingletonComponent(UserAuthUC.type, appObjects);
  }
}
