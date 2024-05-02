export class ObserverList<T> {
  private observers: ((msg: T) => void)[] = [];

  public notify = (msg: T) => {
    this.observers.forEach((obs) => {
      obs(msg);
    });
  }

  public add = (obs: (msg: T) => void) => {
    this.observers.push(obs);
  }

  public remove = (obs: (msg: T) => void) => {
    const index = this.observers.indexOf(obs);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  public clear = () => {
    this.observers = [];
  }
}
