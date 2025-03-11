import { makeAppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities/SnackbarRepo";
import { callActiveSnackbarAction } from "./callActiveSnackbarAction";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const snackbarRepo = makeSnackbarRepo(appObjects.getOrCreate("snackbar"));
  return { appObjects, snackbarRepo };
}

describe("Call Active Snackbar Action", () => {
  it("Triggers the repo", () => {
    const { appObjects, snackbarRepo } = makeTestRig();
    snackbarRepo.callActiveSnackbarAction = jest.fn();

    callActiveSnackbarAction(appObjects);

    expect(snackbarRepo.callActiveSnackbarAction).toBeCalled();
  });
});
