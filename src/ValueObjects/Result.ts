export type Result<T, E> = Resolved<T, E> | Rejected<T, E>;

export const resolve = <T, E = never>(value: T): Resolved<T, E> =>
  new Resolved(value);

export const reject = <T = never, E = unknown>(err: E): Rejected<T, E> =>
  new Rejected(err);

interface IResult<T, E> {
  isResolved: boolean;
  isRejected: boolean;

  value?: T;
  error?: E;

  then<A>(f: (t: T) => A): Result<A, E>;
  catch<U>(f: (e: E) => U): Result<T, U>;
}

export class Rejected<T, E> implements IResult<T, E> {
  readonly error: E;
  readonly value = undefined;

  get isResolved(): boolean {
    return false;
  }
  get isRejected(): boolean {
    return true;
  }

  then<A>(_f: (t: T) => A): Result<A, E> {
    return reject(this.error);
  }

  catch<U>(f: (e: E) => U): Result<T, U> {
    return reject(f(this.error));
  }

  constructor(error: E) {
    this.error = error;
  }
}

export class Resolved<T, E> implements IResult<T, E> {
  readonly value: T;
  readonly error = undefined;

  get isResolved(): boolean {
    return true;
  }
  get isRejected(): boolean {
    return false;
  }

  then<A>(f: (t: T) => A): Result<A, E> {
    return resolve(f(this.value));
  }

  catch<U>(_f: (e: E) => U): Result<T, U> {
    return resolve(this.value);
  }

  constructor(value: T) {
    this.value = value;
  }
}
