import { MemoizedBoolean } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectRepo
} from "../../../HostAppObject";

export type LogSeverity = "LOG" | "WARNING" | "ERROR" | "FATAL";

export type LogEntry = {
  sender: string;
  message: string;
  severity: LogSeverity;
};

export abstract class LoggerEntity extends HostAppObjectEntity {
  static type = "LoggerEntity";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<LoggerEntity>(LoggerEntity.type, appObjects);
  }

  abstract logs: LogEntry[];
  abstract get forwardLogsToConsole(): boolean;
  abstract set forwardLogsToConsole(val: boolean);

  abstract get lastLog(): LogEntry | undefined;

  abstract submitLog: (sender: string, message: string) => void;
  abstract submitWarning: (sender: string, message: string) => void;
  abstract submitError: (sender: string, message: string) => void;
  abstract submitFatal: (sender: string, message: string) => void;
  abstract clear: () => void;
}

export function makeLoggerEntity(appObject: HostAppObject): LoggerEntity {
  return new LoggerEntityImp(appObject);
}

class LoggerEntityImp extends LoggerEntity {
  logs: LogEntry[] = [];

  submitLog = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "LOG");

    if (this.forwardLogsToConsole) {
      console.log(this.formConsoleString(log));
    }

    this.notifyOnChange();
  };

  submitWarning = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "WARNING");
    console.warn(this.formConsoleString(log));
    this.notifyOnChange();
  };

  submitError = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "ERROR");
    console.error(this.formConsoleString(log));
    this.notifyOnChange();
  };

  submitFatal = (sender: string, message: string): void => {
    const log = this.setNewLog(sender, message, "FATAL");
    console.error(this.formConsoleString(log));
    this.notifyOnChange();
  };

  private formConsoleString(log: LogEntry): string {
    const { sender, message } = log;
    return `[${sender}] ${message}`;
  }

  setNewLog(sender: string, message: string, severity: LogSeverity): LogEntry {
    const log: LogEntry = {
      sender,
      message,
      severity
    };

    this.logs.push(log);

    this._lastLog = log;
    return log;
  }

  private memoisedForwardLogs = new MemoizedBoolean(false, this.notifyOnChange);
  get forwardLogsToConsole() {
    return this.memoisedForwardLogs.val;
  }
  set forwardLogsToConsole(val: boolean) {
    this.memoisedForwardLogs.val = val;
  }

  private _lastLog?: LogEntry;
  get lastLog(): LogEntry | undefined {
    return this._lastLog;
  }

  clear = (): void => {
    this.logs = [];
    this._lastLog = undefined;
  };

  constructor(appObject: HostAppObject) {
    super(appObject, LoggerEntity.type);

    this.appObjects.registerSingleton(this);

    this.appObjects.submitLog = this.submitLog;
    this.appObjects.submitWarning = this.submitWarning;
    this.appObjects.submitError = this.submitError;
    this.appObjects.submitFatal = this.submitFatal;
  }
}
