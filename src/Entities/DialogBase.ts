import { MemoizedBoolean } from "./MemoizedBoolean";
import { ObservableEntity } from "./ObservableEntity";


export class DialogBase extends ObservableEntity {
  readonly type: string;

  preventOutsideDismiss: boolean = true;

  protected memoizedOpen = new MemoizedBoolean(false, this.notify);
  get isOpen(): boolean {
    return this.memoizedOpen.val;
  }
  set isOpen(open: boolean) {
    this.memoizedOpen.val = open;
  }

  constructor(type: string) {
    super();
    this.type = type;
  }
}