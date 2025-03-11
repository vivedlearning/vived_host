import { AppObjectRepo } from "@vived/core";
import { UserAuthUC } from "../UCs";

export function loginUser(
  userName: string,
  password: string,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = UserAuthUC.get(appObjects);

  if (uc) {
    return uc.login(userName, password);
  } else {
    appObjects.submitWarning("loginUser", "Unable to find UserAuthUC");
    return Promise.reject(new Error("Unable to find UserAuthUC"));
  }
}
