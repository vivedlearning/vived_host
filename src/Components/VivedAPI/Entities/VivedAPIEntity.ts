import { MemoizedString } from '../../../Entities';
import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';

export class VivedAPIEntity extends HostAppObjectEntity {
  static type = 'VivedAPIEntity';

  static get(appObjects: HostAppObjectRepo): VivedAPIEntity | undefined {
    return getSingletonComponent(VivedAPIEntity.type, appObjects);
  }

  baseUrl: string = 'https://api.vivedlearning.com';
  getEndpointURL = (endpoint: string): URL => {
    return new URL(endpoint, this.baseUrl);
  };

  private memoizedUserToken = new MemoizedString('', this.notifyOnChange);
  get userToken(): string {
    return this.memoizedUserToken.val;
  }
  set userToken(val: string) {
    this.memoizedUserToken.val = val;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, VivedAPIEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
