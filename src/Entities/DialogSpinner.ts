
import { DialogBase } from "./DialogBase";
import { MemoizedString } from "./MemoizedString";

export const spinnerDialogType = "SPINNER";

export class DialogSpinner extends DialogBase {
  readonly type = spinnerDialogType;
  readonly mininumuLifespan = 2000;
  readonly title: string;

  private createdAt?: number;

  private memoizedMessage: MemoizedString;
  get message(): string {
    return this.memoizedMessage.val;
  }
  set message(val: string) {
    this.memoizedMessage.val = val;
  }

  override set isOpen(open: boolean) {
    if (open && this.createdAt === undefined) {
      this.createdAt = Date.now();
    }
    this.memoizedOpen.val = open;
  }

  override get isOpen() {
    return this.memoizedOpen.val;
  }

  close = () => {
    if (this.createdAt === undefined) {
      this.isOpen = false;
      return;
    }

    const timeAlive = Date.now() - this.createdAt;
    const timeleft = this.mininumuLifespan - timeAlive;

    if (timeleft <= 0) {
      this.isOpen = false;
    } else {
      setTimeout(() => {
        this.isOpen = false;
      }, timeleft);
    }
  };

  constructor(title: string, message: string) {
    super(spinnerDialogType);
    this.memoizedMessage = new MemoizedString(message, this.notify);
    this.title = title;
  }
}
