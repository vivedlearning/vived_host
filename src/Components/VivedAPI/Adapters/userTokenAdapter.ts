import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { UserTokenPM } from "../PMs/UserTokenPM";

export const userTokenAdapter: SingletonPmAdapter<string> = {
  defaultVM: "",
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: HostAppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.removeView(setVM);
  }
};
