import { makeAppObjectRepo } from "@vived/core";
import { makeMockUserLoginUC } from "../Mocks/MockUserLoginUC";
import { refreshAuthenticatedUser } from "./refreshAuthenticatedUser";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockLogin = makeMockUserLoginUC(appObjects);

  return { appObjects, mockLogin };
}

describe("Refresh Authenticated User Controller", () => {
  it("Toggles the value on the entity", () => {
    const { mockLogin, appObjects } = makeTestRig();

    refreshAuthenticatedUser(appObjects);

    expect(mockLogin.refreshAuthenticatedUser).toBeCalledWith();
  });
});
