export type Handler = (request: Request) => void;

export interface Request {
  type: string;
  version: number;
  payload?: unknown;
}

// tslint:disable-next-line: class-name
export interface VIVEDApp_3 {
  mount(hostRequestHandler: Handler): Handler;
  mountDev(container: HTMLElement): void;
}
