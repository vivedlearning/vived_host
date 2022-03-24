import { ObserverList } from "./ObserverList";

export type LogSeverity = "LOG" | "WARNING" | "ERROR" | "FATAL";

export type FilterBy = "sender" | "severity" | "message";

export type Log = { sender: string; message: string; severity: LogSeverity };

export type Instructions = "NOTHING" | "SHOWLOG" | "SHOWALL" | "DOWNLOAD";

export type ObservedLog = {
  instruction: Instructions;
  payload: Log | Log[] | DownloadPayload;
};

export type DownloadPayload = {
  filename: string;
  fileData: {
    filterBy: FilterBy | undefined;
    filterValue: string | undefined;
    logs: Log[];
  };
};

export type OnLogAdded = (log: Log) => void;
export type OnLogSaved = (observedLog: ObservedLog) => void;

export interface Logger {
  addLogSaveObserver: (observer: OnLogSaved) => void;
  removeLogSavedObserver: (observer: OnLogSaved) => void;

  addLogAddedObserver: (observer: OnLogAdded) => void;
  removeLogAddedObserver: (observer: OnLogAdded) => void;

  log: (sender: string, message: string) => void;
  warn: (sender: string, message: string) => void;
  error: (sender: string, message: string) => void;
  fatal: (sender: string, message: string) => void;
  clear: () => void;

  setFilter: (filterBy?: FilterBy, filterValue?: string) => void;
  clearFilter: () => void;

  displayAllLogs: () => void;
  toggleShowLogs: () => void;

  downloadLogs: () => void;

  getAllLogs: ()=> Log[];
  getFilteredLogs: ()=>Log[];
}

export function makeLoggerEntity(): Logger {
  return new LoggerImp();
}

class LoggerImp implements Logger {
  private logItems: Log[] = [];
  private showLog: boolean = false;
  private saveObservers = new ObserverList<ObservedLog>();
  private logAddedObservers = new ObserverList<Log>();
  private filterBy: FilterBy | undefined = undefined;
  private filterValue: string | undefined = undefined;


  addLogSaveObserver = (observer: OnLogSaved): void => {
    this.saveObservers.add(observer);
  };

  removeLogSavedObserver = (observer: OnLogSaved): void => {
    this.saveObservers.remove(observer);
  };

  addLogAddedObserver = (observer: OnLogAdded): void => {
    this.logAddedObservers.add(observer);
  };

  removeLogAddedObserver = (observer: OnLogAdded): void => {
    this.logAddedObservers.remove(observer);
  };

  displayAllLogs() {
    const allLogs = this.getFilteredLogs();

    this.saveObservers.notify({
      instruction: "SHOWALL",
      payload: allLogs,
    });
  }

  toggleShowLogs() {
    this.showLog = !this.showLog;
  }

  setFilter(filterBy: FilterBy | undefined, filterValue: string | undefined) {
    this.filterBy = filterBy;
    this.filterValue = filterValue;
  }

  clearFilter() {
    this.filterBy = undefined;
    this.filterValue = undefined;
  }

  log = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "LOG");
    this.logAddedObservers.notify(log);
  };

  warn = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "WARNING");
    this.logAddedObservers.notify(log);
  };

  error = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "ERROR");
    this.logAddedObservers.notify(log);
  };

  fatal = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "FATAL");
    this.logAddedObservers.notify(log);
  };

  setNewLog(sender: string, message: string, severity: LogSeverity): Log {
    const log: Log = {
      sender,
      message,
      severity,
    };

    this.logItems.push(log);

    if (this.showLog) {
      this.saveObservers.notify({
        instruction: "SHOWLOG",
        payload: log,
      });
    }

    return log;
  }

  clear = (): void => {
    this.logItems = [];
  };

  downloadLogs = (): void => {
    let logs = this.getAllLogs();

    this.saveObservers.notify({
      instruction: "DOWNLOAD",
      payload: {
        filename: "playerLogs.json",
        fileData: {
          filterBy: this.filterBy,
          filterValue: this.filterValue,
          logs,
        },
      },
    });
  };

  getAllLogs = (): Log[] => {
    return [...this.logItems]
  }

  getFilteredLogs = (): Log[] => {
    return this.logItems.filter((item) => this.filterFormula(item));
  }

  filterFormula(item: Log): Log | undefined {
    if (this.filterBy) {
      let currentValue = item[this.filterBy]
          .toString()
          .toLocaleLowerCase()
          .trim(),
        desiredValue =
          this.filterValue?.toString().toLocaleLowerCase().trim() ?? "",
        exactMatch = currentValue === desiredValue,
        similarMatch = currentValue.includes(desiredValue);

      if (exactMatch || similarMatch) {
        return item;
      }
    } else {
      return item;
    }
  }
}
