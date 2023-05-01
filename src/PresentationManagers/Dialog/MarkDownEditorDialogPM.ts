import { markDownEditorDialogType, DialogMarkDownEditor, DialogRepo } from '../../Entities';

export interface MarkDownEditorDialogVM {
  initialText: string;
  confirm: () => void;
}

export class MarkDownEditorDialogPM {
  private observingMarkDownEditor: DialogMarkDownEditor | null = null;
  private lastVM?: MarkDownEditorDialogVM;

  doUpdateView = () => {
    let vm: MarkDownEditorDialogVM = {
      initialText: '',
      confirm: () => {
        console.warn('[MarkDownEditorDialogVM.confirm] empty VM!');
      },
    };

    if (this.repo.activeDialog && this.repo.activeDialog.type === markDownEditorDialogType) {
      const markDownEditorDialog = this.repo.activeDialog as DialogMarkDownEditor;

      this.updateAlertObserver(markDownEditorDialog);

      vm = {
        confirm: markDownEditorDialog.confirm,
        initialText: markDownEditorDialog.initialText,
      };
    } else {
      this.updateAlertObserver(null);
    }

    if (!this.vmHasChanged(vm)) return;

    this.updateView(vm);
    this.lastVM = vm;
  };

  updateAlertObserver(markDownEditor: DialogMarkDownEditor | null) {
    if (markDownEditor === this.observingMarkDownEditor) return;

    if (this.observingMarkDownEditor !== null) {
      this.observingMarkDownEditor.removeObserver(this.doUpdateView);
    }

    if (markDownEditor !== null) {
      markDownEditor.addObserver(this.doUpdateView);
    }

    this.observingMarkDownEditor = markDownEditor;
  }

  private vmHasChanged(vm: MarkDownEditorDialogVM): boolean {
    if (this.lastVM === undefined) return true;
    if (vm.initialText === this.lastVM.initialText) {
      return false;
    }

    return true;
  }

  dispose = () => {
    this.repo.removeObserver(this.doUpdateView);
    if (this.observingMarkDownEditor) {
      this.observingMarkDownEditor.removeObserver(this.doUpdateView);
    }
  };

  constructor(private repo: DialogRepo, private updateView: (vm: MarkDownEditorDialogVM) => void) {
    repo.addObserver(this.doUpdateView);
    this.doUpdateView();
  }
}

export const defaultMarkDownEditorDialogVM: MarkDownEditorDialogVM = {
  initialText: '',
  confirm: () => {
    console.warn('[MarkDownEditorDialogVM.confirm] default VM!');
  },
};
