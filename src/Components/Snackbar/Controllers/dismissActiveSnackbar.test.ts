import { makeAppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities/SnackbarRepo";
import { dismissActiveSnackbar } from "./dismissActiveSnackbar";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const snackbarRepo = makeSnackbarRepo(appObjects.getOrCreate("snackbar"));
  return { appObjects, snackbarRepo };
}

describe("Dismiss Active Snackbar", () => {
  it("Triggers the repo", () => {
    const { appObjects, snackbarRepo } = makeTestRig();
    snackbarRepo.dismissActiveSnackbar = jest.fn();

    dismissActiveSnackbar(appObjects);

    expect(snackbarRepo.dismissActiveSnackbar).toBeCalled();
  });
});
