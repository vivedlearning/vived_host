import { AppObject, AppObjectRepo } from "@vived/core";
import { MakeMarkdownDialogUC } from "../UCs/MakeMarkdownDialogUC";

export class MockMakeMarkdownDialogUC extends MakeMarkdownDialogUC {
  make = jest.fn();
  factory = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MakeMarkdownDialogUC.type);
  }
}

export function makeMockMakeMarkdownDialogUC(appObjects: AppObjectRepo) {
  return new MockMakeMarkdownDialogUC(
    appObjects.getOrCreate("MockMakeMarkdownDialogUC")
  );
}
