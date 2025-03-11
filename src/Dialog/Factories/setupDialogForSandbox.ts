import { AppObjectRepo } from "@vived/core";
import { makeDialogQueue } from "../Entities";
import { makeDialogQueuePM } from "../PMs";
import {
  makeMakeAlertDialogUC,
  makeMakeConfirmDialogUC,
  makeMakeMarkdownDialogUC,
  makeMakeSelectModelDialogUC,
  makeMakeSpinnerDialogUC
} from "../UCs";
import { makeAlertFactory } from "./alertDialogFactory";
import { makeConfirmFactory } from "./confirmDialogFactory";
import { makeMarkdownEditorFactory } from "./markdownDialogEditorFactory";
import { makeSelectModelFactory } from "./selectDialogModelFactory";
import { makeSpinnerFactory } from "./spinnerDialogFactory";

export function setupDialogForSandbox(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("Dialog");

  // Entities
  makeDialogQueue(ao);

  // PMs
  makeDialogQueuePM(ao);

  makeMakeAlertDialogUC(ao).factory = makeAlertFactory(appObjects);
  makeMakeConfirmDialogUC(ao).factory = makeConfirmFactory(appObjects);
  makeMakeMarkdownDialogUC(ao).factory = makeMarkdownEditorFactory(appObjects);
  makeMakeSpinnerDialogUC(ao).factory = makeSpinnerFactory(appObjects);
  makeMakeSelectModelDialogUC(ao).factory = makeSelectModelFactory(appObjects);
}
