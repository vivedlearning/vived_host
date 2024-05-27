import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';
import { HostDispatchEntity } from '../Entities';

export abstract class DispatchStopAppUC extends HostAppObjectUC {
  static readonly type = 'DispatchStopAppUC';
  readonly requestType = 'STOP_APP';

  abstract doDispatch(): void;

  static get(appObject: HostAppObject): DispatchStopAppUC | undefined {
    const asset = appObject.getComponent<DispatchStopAppUC>(DispatchStopAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'DispatchStopAppUC.get',
        'Unable to find DispatchStopAppUC on app object ' + appObject.id,
      );
    }
    return asset;
  }

  static getByID(id: string, appObjects: HostAppObjectRepo): DispatchStopAppUC | undefined {
    const appObject =  appObjects.get(id);
    
    if(!appObject) {
      appObjects.submitWarning(
        "DispatchStopAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchStopAppUC.get(appObject);
  }
}

export function makeDispatchStopAppUC(appObject: HostAppObject): DispatchStopAppUC {
  return new DispatchStopAppImp(appObject);
}

class DispatchStopAppImp extends DispatchStopAppUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(): void {
    if (!this.dispatcher) return;
    this.dispatcher.formRequestAndDispatch(this.requestType, this.requestVersion);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchStopAppUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(HostDispatchEntity.type);
    if (!this.dispatcher) {
      this.error('UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first');
      this.dispose();
    }
  }
}
