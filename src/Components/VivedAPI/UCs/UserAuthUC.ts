import { getSingletonComponent, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';

export abstract class UserAuthUC extends HostAppObjectUC {
  static type = 'UserAuthUC';

  abstract login(username: string, password: string): Promise<void>;
  abstract logout(): Promise<void>;
  abstract refreshAuthenticatedUser(): Promise<void>;

  static get(appObjects: HostAppObjectRepo): UserAuthUC | undefined {
    return getSingletonComponent(UserAuthUC.type, appObjects);
  }
}
