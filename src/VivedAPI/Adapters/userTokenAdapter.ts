import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { UserTokenPM } from "../PMs/UserTokenPM";

export const userTokenAdapter: SingletonPmAdapter<string> = {
  defaultVM: "",
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.removeView(setVM);
  }
};
