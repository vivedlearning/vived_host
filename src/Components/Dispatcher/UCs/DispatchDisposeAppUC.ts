import { HostAppObject, HostAppObjectUC } from '../../../HostAppObject';
import { HostDispatchEntity } from '../Entities';

export abstract class DispatchAppDispatcherUC extends HostAppObjectUC {
  static readonly type = 'DispatchAppDispatcherUC';
  readonly requestType = 'DISPOSE_APP';

  abstract doDispatch(): void;

  static get(appObject: HostAppObject): DispatchAppDispatcherUC | undefined {
    const asset = appObject.getComponent<DispatchAppDispatcherUC>(DispatchAppDispatcherUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'DispatchAppDispatcherUC.get',
        'Unable to find DispatchAppDispatcherUC on app object ' + appObject.id,
      );
    }
    return asset;
  }
}

export function makeDispatchDisposeAppUC(appObject: HostAppObject): DispatchAppDispatcherUC {
  return new DispatchDisposeAppUCImp(appObject);
}

class DispatchDisposeAppUCImp extends DispatchAppDispatcherUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(): void {
    if (!this.dispatcher) return;
    this.dispatcher.formRequestAndDispatch(this.requestType, this.requestVersion);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchAppDispatcherUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(HostDispatchEntity.type);
    if (!this.dispatcher) {
      this.error('UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first');
      this.dispose();
    }
  }
}
