import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from "../../../HostAppObject";
import { LoggerEntity } from "../Entities";


export interface LogSummaryVM {
  logsLabel: string;
  warningsLabel: string;
  errorsLabel: string;
}

export abstract class LogSummaryPM extends HostAppObjectPM<LogSummaryVM> {
  static type = "LogSummaryPM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<LogSummaryPM>(LogSummaryPM.type, appObjects);
  }
}
export function makeLogSummaryPM(appObject: HostAppObject): LogSummaryPM {
  return new LogSummaryPMImp(appObject);
}

class LogSummaryPMImp extends LogSummaryPM {
  private get logger() {
    return this.getCachedSingleton<LoggerEntity>(LoggerEntity.type);
  }

  vmsAreEqual(a: LogSummaryVM, b: LogSummaryVM): boolean {
    if (a.errorsLabel !== b.errorsLabel) return false;
    if (a.logsLabel !== b.logsLabel) return false;
    if (a.warningsLabel !== b.warningsLabel) return false;

    return true;
  }

  private onEntityChange = () => {
    if (!this.logger) return;

    const vm: LogSummaryVM = {
      logsLabel: "No Logs have been submitted",
      warningsLabel: "No Warnings have been submitted",
      errorsLabel: "No Errors have been submitted"
    };

    const logs = this.logger.logs;
    let logCnt = 0;
    let warnCnt = 0;
    let errorCnt = 0;

    logs.forEach((log) => {
      if (log.severity === "LOG") {
        logCnt++;
      } else if (log.severity === "WARNING") {
        warnCnt++;
      } else {
        errorCnt++;
      }
    });

    if (logCnt > 0) {
      vm.logsLabel = `${logCnt} Logs have been submitted`;
    }

    if (warnCnt > 0) {
      vm.warningsLabel = `${warnCnt} Warnings have been submitted`;
    }

    if (errorCnt > 0) {
      vm.errorsLabel = `${errorCnt} Errors have been submitted`;
    }

    this.doUpdateView(vm);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, LogSummaryPM.type);

    this.onEntityChange();
    this.logger?.addChangeObserver(this.onEntityChange);
    this.appObjects.registerSingleton(this);
  }
}

export const defaultVM: LogSummaryVM = {
  logsLabel: "",
  warningsLabel: "",
  errorsLabel: ""
};
