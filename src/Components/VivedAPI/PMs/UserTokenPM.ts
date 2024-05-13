import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from '../../../HostAppObject';
import { VivedAPIEntity } from '../Entities';

export class UserTokenPM extends HostAppObjectPM<string> {
  static type = 'UserTokenPM';

  static get(appObjects: HostAppObjectRepo): UserTokenPM | undefined {
    return getSingletonComponent(UserTokenPM.type, appObjects);
  }

  private vivedAPI?: VivedAPIEntity;

  vmsAreEqual(a: string, b: string): boolean {
    return a === b;
  }

  private onEntityChange = () => {
    if (!this.vivedAPI) return;

    this.doUpdateView(this.vivedAPI.userToken);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, UserTokenPM.type);

    this.vivedAPI = appObject.getComponent<VivedAPIEntity>(VivedAPIEntity.type);
    if (!this.vivedAPI) {
      this.error('PM has been added to an App Object that does not have a VivedAPIEntity');
      return;
    }

    this.vivedAPI.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}
