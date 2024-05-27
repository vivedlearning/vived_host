import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';
import { HostDispatchEntity } from '../Entities';

export abstract class DispatchStartAppUC extends HostAppObjectUC {
  static readonly type = 'DispatchStartAppUC';
  readonly requestType = 'START_APP';

  abstract doDispatch(): void;

  static get(appObject: HostAppObject): DispatchStartAppUC | undefined {
    const asset = appObject.getComponent<DispatchStartAppUC>(DispatchStartAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'DispatchStartAppUC.get',
        'Unable to find DispatchStartAppUC on app object ' + appObject.id,
      );
    }
    return asset;
  }

  static getByID(id: string, appObjects: HostAppObjectRepo): DispatchStartAppUC | undefined {
    const appObject =  appObjects.get(id);
    
    if(!appObject) {
      appObjects.submitWarning(
        "DispatchStartAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchStartAppUC.get(appObject);
  }
}

export function makeDispatchStartAppUC(appObject: HostAppObject): DispatchStartAppUC {
  return new DispatchStartAppUCImp(appObject);
}

class DispatchStartAppUCImp extends DispatchStartAppUC {
  readonly requestVersion = 2;
  private dispatcher?: HostDispatchEntity;

  doDispatch(): void {
    if (!this.dispatcher) return;
    this.dispatcher.formRequestAndDispatch(this.requestType, this.requestVersion);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStartAppUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(HostDispatchEntity.type);
    if (!this.dispatcher) {
      this.error('UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first');
      this.dispose();
    }
  }
}
