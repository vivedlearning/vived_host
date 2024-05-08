import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from "../../../HostAppObject";

export class VivedAPIEntity extends HostAppObjectEntity {
  static type = "VivedAPIEntity";

  baseUrl: string = "https://api.vivedlearning.com";
  getEndpointURL = (endpoint: string): URL => {
    return new URL(endpoint, this.baseUrl);
  };

  static get(appObjects: HostAppObjectRepo): VivedAPIEntity | undefined {
    return getSingletonComponent(VivedAPIEntity.type, appObjects);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, VivedAPIEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
