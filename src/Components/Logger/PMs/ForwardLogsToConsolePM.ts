import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { LoggerEntity } from "../Entities";

export abstract class ForwardLogsToConsolePM extends HostAppObjectPM<boolean> {
  static type = "ForwardLogsToConsolePM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<ForwardLogsToConsolePM>(
      ForwardLogsToConsolePM.type,
      appObjects
    );
  }
}
export function makeForwardLogsToConsolePM(
  appObject: HostAppObject
): ForwardLogsToConsolePM {
  return new ForwardLogsToConsolePMImp(appObject);
}

class ForwardLogsToConsolePMImp extends ForwardLogsToConsolePM {
  private get logger() {
    return this.getCachedSingleton<LoggerEntity>(LoggerEntity.type);
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = () => {
    if (!this.logger) return;
    this.doUpdateView(this.logger.forwardLogsToConsole);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, ForwardLogsToConsolePM.type);

    this.onEntityChange();
    this.logger?.addChangeObserver(this.onEntityChange);
    this.appObjects.registerSingleton(this);
  }
}
