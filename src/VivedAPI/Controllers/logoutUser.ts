import { AppObjectRepo } from "@vived/core";
import { UserAuthUC } from "../UCs";

export function logoutUser(appObjects: AppObjectRepo): Promise<void> {
  const uc = UserAuthUC.get(appObjects);

  if (uc) {
    return uc.logout();
  } else {
    appObjects.submitWarning("logoutUser", "Unable to find UserAuthUC");
    return Promise.reject(new Error("Unable to find UserAuthUC"));
  }
}
