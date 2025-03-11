import { makeAppObjectRepo } from "@vived/core";
import { makeMockUserLoginUC } from "../Mocks/MockUserLoginUC";
import { logoutUser } from "./logoutUser";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockLogin = makeMockUserLoginUC(appObjects);

  return { appObjects, mockLogin };
}

describe("Logout User Controller", () => {
  it("Toggles the value on the entity", () => {
    const { mockLogin, appObjects } = makeTestRig();

    logoutUser(appObjects);

    expect(mockLogin.logout).toBeCalledWith();
  });
});
