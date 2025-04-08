import { makeAppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities/SnackbarRepo";
import { makeSnackbar } from "./makeSnackbar";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const snackbarRepo = makeSnackbarRepo(appObjects.getOrCreate("snackbar"));
  return { appObjects, snackbarRepo };
}

describe("Make Snackbar", () => {
  it("Triggers the repo", () => {
    const { appObjects, snackbarRepo } = makeTestRig();
    snackbarRepo.makeSnackbar = jest.fn();

    makeSnackbar(appObjects, "message");

    expect(snackbarRepo.makeSnackbar).toBeCalled();
  });
});
