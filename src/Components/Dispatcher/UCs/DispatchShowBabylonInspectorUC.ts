import { HostAppObject, HostAppObjectUC } from '../../../HostAppObject';
import { HostDispatchEntity } from '../Entities';

export abstract class DispatchShowBabylonInspectorUC extends HostAppObjectUC {
  static readonly type = 'DispatchShowBabylonInspectorUC';
  readonly requestType = 'SHOW_BABYLON_INSPECTOR';

  abstract doDispatch(show: boolean): void;

  static get(appObject: HostAppObject): DispatchShowBabylonInspectorUC | undefined {
    const asset = appObject.getComponent<DispatchShowBabylonInspectorUC>(DispatchShowBabylonInspectorUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'DispatchShowBabylonInspectorUC.get',
        'Unable to find DispatchShowBabylonInspectorUC on app object ' + appObject.id,
      );
    }
    return asset;
  }
}

export function makeDispatchShowBabylonInspectorUC(appObject: HostAppObject): DispatchShowBabylonInspectorUC {
  return new DispatchShowBabylonInspectorUCImp(appObject);
}

class DispatchShowBabylonInspectorUCImp extends DispatchShowBabylonInspectorUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(show: boolean): void {
    if (!this.dispatcher) return;

    const payload = {
      showBabylonInspector: show,
    };
    this.dispatcher.formRequestAndDispatch(this.requestType, this.requestVersion, payload);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchShowBabylonInspectorUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(HostDispatchEntity.type);
    if (!this.dispatcher) {
      this.error('UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first');
      this.dispose();
    }
  }
}
