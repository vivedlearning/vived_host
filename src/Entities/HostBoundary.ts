export type Handler = (request: Request) => void;

export interface Request {
  type: string;
  version: number;
  payload?: unknown;
}